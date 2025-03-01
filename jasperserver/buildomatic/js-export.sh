#!/bin/bash
#
# script to run export command
#

BASEDIR=$(dirname $0);export BASEDIR

JS_EXP_CMD_CLASS=com.jaspersoft.jasperserver.export.ExportCommand
export JS_EXP_CMD_CLASS

JS_CMD_NAME=$0
export JS_CMD_NAME

export ANT_ARGS="$ANT_ARGS -q -emacs -logger com.jaspersoft.buildomatic.ImportExportLogger -lib . -lib lib"

$BASEDIR/js-ant validate-database validate-keystore

if [ $? -eq 0 ];
then
  $BASEDIR/bin/js-import-export.sh $*
fi
