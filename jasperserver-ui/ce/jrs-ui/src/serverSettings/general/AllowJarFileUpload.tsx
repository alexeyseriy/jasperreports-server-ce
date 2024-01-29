/*
 * Copyright (C) 2005 - 2023. Cloud Software Group, Inc. All Rights Reserved.
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

import React, { useEffect } from 'react'
import { Switch } from 'js-sdk/src/common/component/material-ui/Switch/Switch';
import { Typography } from 'js-sdk/src/common/component/material-ui/Typography/Typography';
import { CustomizableCard } from 'js-sdk/src/common/component/material-ui/Cards/CustomizableCard';
import showHideDriverJarUpload from '../services/allowJarUploadService'
import locale from '../../i18n/GeneralSettingsBundle.properties'

const i18n: {
    [key: string]: string
} = locale;
const Children = ({ checkedValue, handleChange }: {checkedValue: boolean, handleChange: ()=> void}) => {
    return (
        <>
            <Switch checked={checkedValue} inline classes={{ root: 'jr-uTextBold' }} label={i18n['server.settings.general.label']} onChange={handleChange} />
            <Typography className="jr-mText jr-uGrey-light jr-uWidth-80pc" variant="body1">{i18n['server.settings.general.description']}</Typography>
        </>
    )
};
const AllowJarFileUpload = () => {
    const [checked, setChecked] = React.useState(true);
    const [flowExecution, setFlowExecution] = React.useState('');

    useEffect(() => {
        setFlowExecution((document.querySelector('#_flowExecutionKey') as HTMLInputElement)?.value);
        setChecked(((document.querySelector('#_allowJarFileUpload') as HTMLInputElement)?.value) === 'true');
    }, [])

    const handleChange = () => {
        setChecked(!checked);
        showHideDriverJarUpload(!checked, flowExecution);
    };

    return (
        <div className="jr-mForm">
            <div className="jr-mForm-section jr-uWidth-800px">
                <Typography className="jr-mText jr-mTextTitle jr-mTextMedium jr-uMargin-b-05">
                    <span className="jr-uColor-theme-medium">{i18n['server.settings.general.title']}</span>
                </Typography>
                <CustomizableCard
                    elevation={0}
                    className="jr-mCardShaded"
                    paddedCardBodyContent={<Children checkedValue={checked} handleChange={handleChange} />}
                    isLastOrSingleCard
                />
            </div>
        </div>
    )
};
export default AllowJarFileUpload;
