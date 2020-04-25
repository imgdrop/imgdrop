import { createStyles, makeStyles } from '@material-ui/core';
import { Panorama } from '@material-ui/icons';
import React from 'react';
import { useDropzone } from 'react-dropzone';

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

export interface ImageDropProps {
   onImageDropped(file: File): void;
}

export const ImageDrop: React.FC<ImageDropProps> = ({ onImageDropped }) => {
   const classes = useStyles();
   const { getRootProps, getInputProps, isDragActive, isFileDialogActive } = useDropzone({
      onDrop(files) {
         files.forEach((file) => onImageDropped(file));
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
