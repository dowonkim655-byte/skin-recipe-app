import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '내 피부 레시피 - 맞춤 원료 배합';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #fde8e6 0%, #faf7f3 60%, #f0e8dc 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'rgba(185,112,112,0.08)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: 'rgba(185,112,112,0.06)',
          display: 'flex',
        }} />

        {/* Logo circle */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'linear-gradient(135deg, #fde8e6, #f9d0cc)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 32,
          boxShadow: '0 8px 32px rgba(185,112,112,0.2)',
        }}>
          <span style={{ fontSize: 60 }}>🌸</span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 68,
          fontWeight: 900,
          color: '#b97070',
          letterSpacing: '-2px',
          marginBottom: 16,
          display: 'flex',
        }}>
          My Skin Recipe
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 30,
          color: '#a08878',
          marginBottom: 48,
          display: 'flex',
        }}>
          Personalized Ingredient Formula
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['6 Questions', 'Custom Formula', 'DIY Guide'].map((label) => (
            <div key={label} style={{
              paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12,
              background: 'white',
              borderRadius: 50,
              color: '#b97070',
              fontSize: 22,
              fontWeight: 600,
              boxShadow: '0 2px 12px rgba(185,112,112,0.15)',
              display: 'flex',
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* URL badge */}
        <div style={{
          position: 'absolute', bottom: 40,
          paddingLeft: 28, paddingRight: 28, paddingTop: 12, paddingBottom: 12,
          background: '#b97070',
          borderRadius: 50,
          color: 'white',
          fontSize: 22,
          fontWeight: 600,
          display: 'flex',
        }}>
          skin-recipe-app.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
