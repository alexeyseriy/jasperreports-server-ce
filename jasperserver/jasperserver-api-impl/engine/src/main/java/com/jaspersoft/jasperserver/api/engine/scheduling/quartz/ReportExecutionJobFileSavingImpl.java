/*
 * Copyright (C) 2005-2023. Cloud Software Group, Inc. All Rights Reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased a commercial license agreement from Jaspersoft,
 * the following license terms apply:
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package com.jaspersoft.jasperserver.api.engine.scheduling.quartz;

import com.jaspersoft.jasperserver.api.JSException;
import com.jaspersoft.jasperserver.api.JSExceptionWrapper;
import com.jaspersoft.jasperserver.api.common.crypto.PasswordCipherer;
import com.jaspersoft.jasperserver.api.common.util.FTPService;
import com.jaspersoft.jasperserver.api.engine.common.util.impl.FTPUtil;
import com.jaspersoft.jasperserver.api.engine.scheduling.domain.FTPInfo;
import com.jaspersoft.jasperserver.api.engine.scheduling.domain.ReportJob;
import com.jaspersoft.jasperserver.api.engine.scheduling.domain.ReportJobRepositoryDestination;
import com.jaspersoft.jasperserver.api.logging.audit.context.AuditContext;
import com.jaspersoft.jasperserver.api.logging.audit.domain.AuditEvent;
import com.jaspersoft.jasperserver.api.logging.audit.domain.AuditEventType;
import com.jaspersoft.jasperserver.api.metadata.common.domain.ContentResource;
import com.jaspersoft.jasperserver.api.metadata.common.domain.DataContainer;
import com.jaspersoft.jasperserver.api.metadata.common.domain.Folder;
import com.jaspersoft.jasperserver.api.metadata.common.domain.Resource;
import com.jaspersoft.jasperserver.api.metadata.common.domain.util.DataContainerStreamUtil;
import com.jaspersoft.jasperserver.api.metadata.common.service.JSResourceNotFoundException;
import com.jaspersoft.jasperserver.api.metadata.common.service.RepositoryService;
import com.jaspersoft.jasperserver.api.metadata.common.util.LockHandle;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.net.util.TrustManagerUtils;
import org.springframework.dao.DataAccessResourceFailureException;

import java.io.*;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static com.jaspersoft.jasperserver.api.logging.audit.domain.AuditEventType.SCHEDULE_OUTPUT_DETAILS;

/**
 * @author Ivan Chan (ichan@jaspersoft.com)
 * @version $Id$
 */
public class ReportExecutionJobFileSavingImpl implements ReportExecutionJobFileSaving {

    private static final Log log = LogFactory.getLog(ReportExecutionJobFileSavingImpl.class);
    protected static final String LOCK_NAME_CONTENT_RESOURCE = "reportSchedulerOutput";
    public static final String OUTPUT_TO_DESTINATION_CATEGORY = "Output Destination";
    private FTPService ftpService = new FTPUtil();
    private boolean enableSaveToHostFS;

    private AuditContext auditContext;

    public AuditContext getAuditContext() {
        return auditContext;
    }

    public void setAuditContext(AuditContext auditContext) {
        this.auditContext = auditContext;
    }

    public FTPService getFtpService() {
        return ftpService;
    }

    public void setFtpService(FTPService ftpService) {
        this.ftpService = ftpService;
    }


    public void save(ReportExecutionJob job, ReportOutput output, boolean useFolderHierarchy, ReportJob jobDetails, boolean isDashBoardExecution) {
        boolean auditEventCreated = false;
        boolean continueSave = true;
        if (jobDetails.getContentRepositoryDestination() == null) return;
        try {
            ReportJobRepositoryDestination repositoryDestination = jobDetails.getContentRepositoryDestination();
            if (repositoryDestination.isSaveToRepository()){
                long startTime = System.currentTimeMillis();
                saveToRepository(job, output, jobDetails);
                auditEventCreated =true;
                createOutputFormatAuditEvent(isDashBoardExecution);
                addToAuditEvent(startTime,ReportExecutionJob.SAVE_TO_REPOSITORY);
            }
        }  catch (Exception e) {
            addExceptionToAudit(e, OUTPUT_TO_DESTINATION_CATEGORY);
            job.handleException(job.getMessage("report.scheduling.error.saving.to.repository", new Object[]{output.getFilename()}), e);
            continueSave = false;
        }

        if (!isSaveToDisk(jobDetails) && !isSaveToFTPServer(jobDetails)) return;

        Map<String, DataContainer> zipOutput = null;
        try {
            zipOutput = zipFile(job, output, useFolderHierarchy);
        }  catch (Exception e) {
            job.handleException(job.getMessage("report.scheduling.error.creating.zip.output", new Object[]{output.getFilename()}), e);
        }
        for (Map.Entry<String, DataContainer> entry : zipOutput.entrySet()) {
            try {
                if (isEnableSaveToHostFS() && continueSave) {
                    if (isSaveToDisk(jobDetails)) {
                        long startTime = System.currentTimeMillis();
                        saveToDisk(job, entry.getKey(), entry.getValue(), jobDetails);
                        if (!auditEventCreated) {
                            createOutputFormatAuditEvent(isDashBoardExecution);
                            auditEventCreated = true;
                        }
                        addToAuditEvent(startTime, ReportExecutionJob.SAVE_TO_DISK);
                    }
                } else {
                    log.debug("skipped saveToDisk since isEnableSaveToHostFS=" + isEnableSaveToHostFS());
                }
            }  catch (Exception e) {
                addExceptionToAudit(e, OUTPUT_TO_DESTINATION_CATEGORY);
                job.handleException(job.getMessage("report.scheduling.error.writing.to.disk", new Object[]{output.getFilename()}), e);
                continueSave = false;
            }
            try {
                if (isSaveToFTPServer(jobDetails) && continueSave) {
                    saveToFTPServer(job, entry.getKey(), entry.getValue(), jobDetails, auditEventCreated, isDashBoardExecution);
                }
            }  catch (Exception e) {
                addExceptionToAudit(e, OUTPUT_TO_DESTINATION_CATEGORY);
                job.handleException(job.getMessage("report.scheduling.error.updating.to.server", new Object[]{output.getFilename()}), e);
            }
        }


    }

    private String getSSHKeyData(ReportExecutionJob job, String uri) {
        String sshKeyData = null;
        try {
            // get file data
            sshKeyData = new String(job.getRepository().getResourceData(job.executionContext, uri).getData());

            // decode if encrypted
            sshKeyData = PasswordCipherer.getInstance().decodePassword(sshKeyData);
        } catch (JSResourceNotFoundException e) {
            log.error("Failed to read the SSH Private Key from repository.");
        } catch (DataAccessResourceFailureException e) {
            log.warn("Failed to decrypt the SSH Private Key. Most likely reason is unencrypted data in db.");
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return sshKeyData;
    }


    protected void saveToRepository(ReportExecutionJob job, ReportOutput output, ReportJob jobDetails) {
        RepositoryService repositoryService = job.getRepository();
		ReportJobRepositoryDestination repositoryDestination = jobDetails.getContentRepositoryDestination();
		if (!repositoryDestination.isSaveToRepository()) return;
		//long startTime = System.currentTimeMillis();
		List children = output.getChildren();
		List childResources = new ArrayList(children.size());
		for (Iterator it = children.iterator(); it.hasNext();) {
			ReportOutput childOutput = (ReportOutput) it.next();

			ContentResource childRes = (ContentResource) repositoryService.newResource(job.executionContext, ContentResource.class);;
			childRes.setName(childOutput.getFilename());
			childRes.setLabel(childOutput.getFilename());
			childRes.setFileType(childOutput.getFileType());
			childRes.setDataContainer(childOutput.getPersistenceData());
			childResources.add(childRes);
		}

		ContentResource contentRes = null;
        String folderURI = null;
        if (repositoryDestination.isUsingDefaultReportOutputFolderURI() && (repositoryDestination.getDefaultReportOutputFolderURI() != null))
            folderURI = repositoryDestination.getDefaultReportOutputFolderURI();
        else folderURI = repositoryDestination.getFolderURI();

		String resURI = folderURI + Folder.SEPARATOR + output.getFilename();
		LockHandle lock = lockOutputResource(job, resURI);
		try {
			Resource existingRes = repositoryService.getResource(job.executionContext, resURI);
			if (repositoryDestination.isOverwriteFiles()) {
				if (existingRes != null) {
					if (!(existingRes instanceof ContentResource)) {
						String quotedResURI = "\"" + resURI + "\"";
						throw new JSException("jsexception.report.no.content.resource", new Object[] {quotedResURI});
					}
					contentRes = (ContentResource) existingRes;
				}
			} else if (existingRes != null) {
				throw new JSException("jsexception.report.resource.already.exists.no.overwrite", new Object[] {resURI});
			}

			if (contentRes == null) {
				contentRes = (ContentResource) repositoryService.newResource(job.executionContext, ContentResource.class);
				contentRes.setName(output.getFilename());
				contentRes.setLabel(output.getFilename());
				contentRes.setParentFolder(repositoryDestination.getFolderURI());
			}

            contentRes.setDescription(jobDetails.getContentRepositoryDestination().getOutputDescription());
            contentRes.setFileType(output.getFileType());
			contentRes.setDataContainer(output.getPersistenceData());
			contentRes.setResources(childResources);

            if (job.executionContext.getAttributes() == null) {
                job.executionContext.setAttributes(new ArrayList());
            }
            job.executionContext.getAttributes().add(RepositoryService.IS_OVERWRITING);
			repositoryService.saveResource(job.executionContext, contentRes);
			output.setRepositoryPath(resURI);
		} finally {
			unlock(job, lock);
		}
    }

    protected boolean isSaveToDisk(ReportJob jobDetails) {
        ReportJobRepositoryDestination repositoryDestination = jobDetails.getContentRepositoryDestination();
        return ((repositoryDestination != null) && (repositoryDestination.getOutputLocalFolder() != null));
    }

    protected void saveToDisk(ReportExecutionJob job, String fileName, DataContainer data, ReportJob jobDetails) throws Exception {
        ReportJobRepositoryDestination repositoryDestination = jobDetails.getContentRepositoryDestination();
        String path = repositoryDestination.getOutputLocalFolder() + File.separator +  fileName;


        if (!repositoryDestination.isOverwriteFiles() && (new File(path)).exists()) {
            throw new JSException("jsexception.report.resource.already.exists.no.overwrite", new Object[] {path});
        }
        File dirFile = new File(repositoryDestination.getOutputLocalFolder());
        if (!dirFile.exists()) {
            throw new JSException("jsexception.report.resource.output.local.folder.does.not.exist", new Object[] {repositoryDestination.getOutputLocalFolder()});
        }
        FileOutputStream outputStream= new FileOutputStream(path, false);
        copy(data, outputStream);
    }

    protected boolean isSaveToFTPServer(ReportJob jobDetails) {
        ReportJobRepositoryDestination repositoryDestination = jobDetails.getContentRepositoryDestination();
        return (repositoryDestination != null) && (repositoryDestination.getOutputFTPInfo() != null) &&
            (repositoryDestination.getOutputFTPInfo().getServerName() != null);
    }

    protected void saveToFTPServer(ReportExecutionJob job, String fileName, DataContainer data, ReportJob jobDetails,
                                   boolean auditEventCreated, boolean isDashboardExecution) {
        long startTime = System.currentTimeMillis();
        FTPInfo ftpInfo =  jobDetails.getContentRepositoryDestination().getOutputFTPInfo();
        try {
            FTPService.FTPServiceClient ftpServiceClient = null;
            if (ftpInfo.getType().equals(FTPInfo.TYPE_FTP))
                ftpServiceClient = ftpService.connectFTP(ftpInfo.getServerName(), ftpInfo.getPort(), ftpInfo.getUserName(), ftpInfo.getPassword());
            else if (ftpInfo.getType().equals(FTPInfo.TYPE_FTPS)) {
                ftpServiceClient = ftpService.connectFTPS(ftpInfo.getServerName(), ftpInfo.getPort(), ftpInfo.getProtocol(), ftpInfo.isImplicit(), ftpInfo.getPbsz(), ftpInfo.getProt(), ftpInfo.getUserName(), ftpInfo.getPassword(),
                        false, TrustManagerUtils.getAcceptAllTrustManager());
            } else if (ftpInfo.getType().equals(FTPInfo.TYPE_SFTP)) {

                // Read SSH Private Key data from repo file resource
                String sshKeyData = null;
                if (ftpInfo.getSshKey() != null) {
                    sshKeyData = getSSHKeyData(job, ftpInfo.getSshKey());
                }

                ftpServiceClient = ftpService.connectSFTP(ftpInfo.getServerName(), ftpInfo.getPort(), ftpInfo.getUserName(), ftpInfo.getPassword(), null, sshKeyData, ftpInfo.getSshPassphrase());
            }
            ftpServiceClient.changeDirectory(ftpInfo.getFolderPath());
            if (!jobDetails.getContentRepositoryDestination().isOverwriteFiles() && ftpServiceClient.exists(fileName)) {
               throw new JSException("jsexception.report.resource.already.exists.no.overwrite", new Object[] {ftpInfo.getServerName() + ftpInfo.getFolderPath() + "/" + fileName});
            }
            
            InputStream inputStream = data.getInputStream();
            try {
                ftpServiceClient.putFile(fileName, inputStream);
            } finally {
            	try {
                	inputStream.close();
            	} catch (IOException e) {
            		log.warn("Failed to close input stream", e);
            	}
            }
            ftpServiceClient.disconnect();
            if (!auditEventCreated) {
                createOutputFormatAuditEvent(isDashboardExecution);
            }
            addToAuditEvent(startTime, ReportExecutionJob.SAVE_TO_FTP_SERVER);
        } catch (Exception ex) {
            addExceptionToAudit(ex, OUTPUT_TO_DESTINATION_CATEGORY);
            job.handleException(job.getMessage("report.scheduling.error.upload.to.ftp.server", new Object[]{ftpInfo.getServerName() + ftpInfo.getFolderPath() + "/" + fileName}), ex);
        }
    }

    protected String getChildrenFolderName(ReportExecutionJob job, String resourceName) {
		return job.getRepository().getChildrenFolderName(resourceName);
	}

    protected LockHandle lockOutputResource(ReportExecutionJob job, String uri) {
		return job.getLockManager().lock(LOCK_NAME_CONTENT_RESOURCE, uri);
	}

	protected void unlock(ReportExecutionJob job, LockHandle lock) {
		job.getLockManager().unlock(lock);
	}

    private void copy(DataContainer data, FileOutputStream os) throws IOException {
      DataContainerStreamUtil.pipeDataAndCloseInput(data.getInputStream(), os);
      os.flush();
      os.close();
    }

    private Map<String, DataContainer> zipFile(ReportExecutionJob job, ReportOutput output, boolean useFolderHierarchy) throws IOException {
        String attachmentName;
		DataContainer attachmentData;

        if (output.getChildren().isEmpty()) {
			attachmentName = output.getFilename();
			attachmentData = output.getData();
		} else {  // use zip format
			attachmentData = job.createDataContainer();
			boolean close = true;
			ZipOutputStream zipOut = new ZipOutputStream(attachmentData.getOutputStream());
			try {
				zipOut.putNextEntry(new ZipEntry(output.getFilename()));
				DataContainerStreamUtil.pipeDataAndCloseInput(output.getData().getInputStream(), zipOut);
				zipOut.closeEntry();

				for (Iterator it = output.getChildren().iterator(); it.hasNext();) {
					ReportOutput child = (ReportOutput) it.next();
                    String childName = child.getFilename();
					if (useFolderHierarchy) childName = getChildrenFolderName(job, output.getFilename()) + '/' + childName;
					zipOut.putNextEntry(new ZipEntry(childName));
					DataContainerStreamUtil.pipeDataAndCloseInput(child.getData().getInputStream(), zipOut);
					zipOut.closeEntry();
				}

				zipOut.finish();
				zipOut.flush();

				close = false;
				zipOut.close();
			} catch (IOException e) {
				throw new JSExceptionWrapper(e);
			} finally {
				if (close) {
					try {
						zipOut.close();
					} catch (IOException e) {
						log.error("Error closing stream", e);
					}
				}
			}
			attachmentName = output.getFilename() + ".zip";
		}

		Map<String, DataContainer> result = new HashMap<>();
		result.put(attachmentName, attachmentData);
		return result;
    }

//    in case the admin decided to block jobs from writing to the file system
    public boolean isEnableSaveToHostFS() {
        return enableSaveToHostFS;
    }

    public void setEnableSaveToHostFS(boolean enableSaveToHostFS) {
        this.enableSaveToHostFS = enableSaveToHostFS;
    }

    private void addToAuditEvent(long startTime, String propertyName) {
        auditContext.doInAuditContext(SCHEDULE_OUTPUT_DETAILS.toString(),
                new AuditContext.AuditContextCallbackWithEvent() {
                    public void execute(AuditEvent auditEvent) {
                        long endTime = System.currentTimeMillis();
                        auditContext.addPropertyToAuditEvent(propertyName, endTime-startTime, auditEvent);

                    }
                });
    }

    protected void addPropertyToAuditEvent(final String propertyType, final Object param) {
        auditContext.doInAuditContext(AuditEventType.RUN_REPORT.toString(),
                new AuditContext.AuditContextCallbackWithEvent() {
                    public void execute(AuditEvent auditEvent) {
                        getAuditContext()
                                .addPropertyToAuditEvent(propertyType, param, auditEvent);
                    }
                });
    }
    private void addExceptionToAudit(Throwable e, String category) {
        Throwable suppressedException = e;
        if (e.getSuppressed() != null && e.getSuppressed().length > 0)
            suppressedException = e.getSuppressed()[0];
        addPropertyToAuditEvent("exceptionCategory", category);
        addPropertyToAuditEvent("exception", suppressedException);
    }

    public void createOutputFormatAuditEvent(boolean isDashboardExecution) {
        if (!isDashboardExecution) {
            auditContext.doInAuditContext(new AuditContext.AuditContextCallback() {
                public void execute() {
                    auditContext.createAuditEvent(SCHEDULE_OUTPUT_DETAILS.toString());
                }
            });
        }



    }


}
