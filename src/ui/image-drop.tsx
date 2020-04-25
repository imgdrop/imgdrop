import { createStyles, makeStyles } from '@material-ui/core';
import { Panorama } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { convertImage } from '../convert';
import { logError } from '../logging';

const useStyles = makeStyles((theme) =>
   createStyles({
      root: {
         width: '100vw',
         height: '100vh',
         padding: theme.spacing(2),
         '&:focus': {
            outline: 'none',
         },
      },

      border: {
         width: '100%',
         height: '100%',
         borderWidth: theme.spacing(1),
         borderStyle: 'dashed',
         borderColor: theme.palette.grey.A100,
         borderRadius: theme.spacing(2),
         padding: theme.spacing(1),

         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',
         transition: 'border-color 0.5s',
      },

      activeBorder: {
         borderColor: theme.palette.primary.light,
      },

      icon: {
         fontSize: theme.typography.pxToRem(200),
         marginBottom: theme.spacing(1),
         color: theme.palette.grey.A200,
         transition: 'color 0.5s',
      },

      activeIcon: {
         color: theme.palette.primary.light,
      },

      text: {
         ...theme.typography.h4,
         textAlign: 'center',
         color: theme.palette.grey.A400,
      },
   })
);

export const ImageDrop: React.FC = () => {
   const classes = useStyles();
   const { enqueueSnackbar } = useSnackbar();
   const { getRootProps, getInputProps, isDragActive, isFileDialogActive } = useDropzone({
      onDrop(files) {
         files.map(async (file) => {
            try {
               await convertImage(file);
               enqueueSnackbar(`Successfully converted '${file.name}'`, {
                  variant: 'success',
               });
            } catch (error) {
               logError(error);
               enqueueSnackbar(`Failed to convert to '${file.name}'`, {
                  variant: 'error',
               });
            }
         });
      },
   });

   const isActive = isDragActive || isFileDialogActive;

   /* eslint-disable react/jsx-props-no-spreading */
   return (
      <div {...getRootProps()} className={classes.root}>
         <input {...getInputProps()} />
         <div className={`${classes.border} ${isActive ? classes.activeBorder : ''}`}>
            <Panorama
               className={`${classes.icon} ${isActive ? classes.activeIcon : ''}`}
            />
            <div className={classes.text}>
               Just drop an image to instantly convert it to PNG
            </div>
         </div>
      </div>
   );
   /* eslint-enable */
};
