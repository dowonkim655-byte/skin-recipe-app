import { ImageResponse } from 'next/og';

export const runtime = 'edge';

function FlowerIcon({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #fde8e6 0%, #f0d4d0 100%)',
        borderRadius: size * 0.235,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: size * 0.58, display: 'flex' }}>🌸</div>
    </div>
  );
}

export async function GET() {
  return new ImageResponse(<FlowerIcon size={512} />, { width: 512, height: 512 });
}
