import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '내 피부 레시피 - 나만을 위한 맞춤 원료 배합';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #fde8e6 0%, #faf7f3 50%, #f0e8dc 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative circles */}
        <div style={{
          position: 'absolute', top: -120, right: -120,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(185,112,112,0.10)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(185,112,112,0.07)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', top: 60, left: 60,
          width: 140, height: 140, borderRadius: '50%',
          background: 'rgba(185,112,112,0.05)',
          display: 'flex',
        }} />

        {/* Logo + Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 20 }}>
          {/* Logo circle */}
          <div style={{
            width: 110, height: 110, borderRadius: '50%',
            background: 'linear-gradient(135deg, #fde8e6, #f9d0cc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(185,112,112,0.25)',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 56 }}>🌸</span>
          </div>

          {/* Title block */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#b97070',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginBottom: 8,
              display: 'flex',
            }}>
              My Skin Recipe
            </div>
            <div style={{
              fontSize: 72,
              fontWeight: 900,
              color: '#4a3030',
              letterSpacing: '-2px',
              lineHeight: 1,
              display: 'flex',
            }}>
              내 피부 레시피
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 28,
          color: '#8b7060',
          marginBottom: 52,
          display: 'flex',
          textAlign: 'center',
        }}>
          6가지 질문으로 찾는 나만의 맞춤 원료 배합
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 44 }}>
          {[
            { value: '36+', label: '맞춤 레시피' },
            { value: '30+', label: '검증된 성분' },
            { value: '무료', label: '완전 무료' },
          ].map((stat) => (
            <div key={stat.label} style={{
              paddingLeft: 32, paddingRight: 32, paddingTop: 18, paddingBottom: 18,
              background: 'white',
              borderRadius: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 4px 20px rgba(185,112,112,0.12)',
              minWidth: 140,
            }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#b97070', display: 'flex' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 18, color: '#a08878', display: 'flex' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 14 }}>
          {[
            { icon: '🔬', label: '피부 타입 분석' },
            { icon: '🧪', label: '원료 배합 레시피' },
            { icon: '🛒', label: 'DIY 가이드 + 구매' },
          ].map((f) => (
            <div key={f.label} style={{
              paddingLeft: 22, paddingRight: 22, paddingTop: 12, paddingBottom: 12,
              background: '#fde8e6',
              borderRadius: 50,
              color: '#b97070',
              fontSize: 20,
              fontWeight: 700,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}>
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>

        {/* URL badge */}
        <div style={{
          position: 'absolute', bottom: 36,
          paddingLeft: 28, paddingRight: 28, paddingTop: 12, paddingBottom: 12,
          background: '#b97070',
          borderRadius: 50,
          color: 'white',
          fontSize: 20,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span>🌸</span>
          <span>skin-recipe-app.vercel.app</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
