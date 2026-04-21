import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          borderRadius: 120,
          background: 'linear-gradient(135deg, #fde8e6 0%, #f9d0cc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 280 }}>🌸</span>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
