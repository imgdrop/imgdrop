// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Link, createStyles, makeStyles } from '@material-ui/core';
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
         padding: theme.spacing(2),

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

      subtext: {
         ...theme.typography.h6,
         textAlign: 'center',
         color: theme.palette.grey.A400,
      },
   })
);

export interface ImageDropProps {
   imageName?: string;
   onImageDropped(files: File[]): void;
}

export const ImageDrop: React.FC<ImageDropProps> = ({ imageName, onImageDropped }) => {
   const classes = useStyles();
   const { getRootProps, getInputProps, isDragActive, isFileDialogActive } = useDropzone({
      onDrop: (files) => onImageDropped(files),
   });

   const isActive = isDragActive || isFileDialogActive;
   const stopPropogation = (event: React.UIEvent): void => event.stopPropagation();

   /* eslint-disable react/jsx-props-no-spreading */
   return (
      <div {...getRootProps()} className={classes.root}>
         <input {...getInputProps()} />
         <div className={`${classes.border} ${isActive ? classes.activeBorder : ''}`}>
            <Panorama
               className={`${classes.icon} ${isActive ? classes.activeIcon : ''}`}
            />
            <div className={classes.text}>
               Just drop {imageName ? `a ${imageName} image` : 'an image'} to instantly
               convert it to PNG
            </div>
            <div className={classes.subtext}>
               Your images are never uploaded (
               <Link
                  href='https://github.com/imgdrop/imgdrop/blob/master/PRIVACY.md'
                  target='_blank'
                  onClick={stopPropogation}
               >
                  Privacy&nbsp;Policy
               </Link>
               )
            </div>
            <div className={classes.subtext}>
               Made with pride by a gay man{' '}
               <span role='img' aria-label='pride flag'>
                  🏳️‍🌈
               </span>{' '}
               (
               <Link
                  href='https://github.com/imgdrop/imgdrop'
                  target='_blank'
                  onClick={stopPropogation}
               >
                  Github
               </Link>
               )
            </div>
         </div>
      </div>
   );
   /* eslint-enable */
};
