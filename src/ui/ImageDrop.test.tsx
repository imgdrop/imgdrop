import React from 'react';
import * as dropzone from 'react-dropzone';
import TestRenderer from 'react-test-renderer';
import { ImageDrop } from './ImageDrop';
import { Link } from '@material-ui/core';

describe(ImageDrop, () => {
   let useDropzoneSpy: jest.SpyInstance;
   let imageDroppedMock: jest.Mock;

   const createRenderer = (imageName?: string): TestRenderer.ReactTestRenderer => {
      return TestRenderer.create(
         <ImageDrop imageName={imageName} onImageDropped={imageDroppedMock} />
      );
   };

   beforeEach(() => {
      useDropzoneSpy = jest.spyOn(dropzone, 'useDropzone');
      imageDroppedMock = jest.fn();
   });

   it('matches the snapshot', () => {
      const renderer = createRenderer();
      expect(renderer.toJSON()).toMatchSnapshot();
   });

   it('matches the snapshot when provided a name', () => {
      const renderer = createRenderer('PNG');
      expect(renderer.toJSON()).toMatchSnapshot();
   });

   it('matches the snapshot when active', () => {
      let setDropzoneState: React.Dispatch<React.SetStateAction<dropzone.DropzoneState>>;
      useDropzoneSpy.mockImplementation(() => {
         let dropzoneState;
         [dropzoneState, setDropzoneState] = React.useState<dropzone.DropzoneState>({
            getRootProps: (): {} => ({}),
            getInputProps: (): {} => ({}),
            isDragActive: false,
            isFileDialogActive: false,
         } as any);
         return dropzoneState;
      });
      const renderer = createRenderer();

      const json = renderer.toJSON();
      TestRenderer.act(() => {
         setDropzoneState((state) => ({
            ...state,
            isDragActive: true,
         }));
      });

      const activeJson = renderer.toJSON();
      expect(activeJson).not.toEqual(json);
      expect(activeJson).toMatchSnapshot();

      TestRenderer.act(() => {
         setDropzoneState((state) => ({
            ...state,
            isDragActive: false,
            isFileDialogActive: true,
         }));
      });

      expect(JSON.stringify(renderer.toJSON())).toBe(JSON.stringify(activeJson));
   });

   it('calls the provided callback when a file is dropped', () => {
      createRenderer();
      expect(useDropzoneSpy).toHaveBeenCalledWith({
         onDrop: expect.any(Function),
      });

      useDropzoneSpy.mock.calls[0][0].onDrop(['file', 'image']);
      expect(imageDroppedMock).toHaveBeenCalledWith(['file', 'image']);
   });

   it('stops propogation on link clicks', () => {
      const renderer = createRenderer();
      const eventMock = {
         stopPropagation: jest.fn()
      };
      renderer.root.findAllByType(Link).forEach(link => {
         link.props.onClick(eventMock);
      });
      expect(eventMock.stopPropagation).toHaveBeenCalledWith();
      expect(eventMock.stopPropagation).toHaveBeenCalledTimes(2);
   });
});
