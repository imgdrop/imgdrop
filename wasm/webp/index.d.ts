declare const webp: () => {
   promise: Promise<void>;
   HEAPU8: Uint8Array;
   webpAllocate(size: number): number;
   webpDecode(data: number, dataSize: number): number;
   webpWidth(): number;
   webpHeight(): number;
};

export default webp;
