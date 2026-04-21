import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') ?? '내 피부 레시피';
  const skin = searchParams.get('skin') ?? '맞춤 피부 레시피';
  const ings = searchParams.get('ings') ?? '';
  const ingList = ings ? ings.split(',').filter(Boolean).slice(0, 4) : [];

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #4a3030 0%, #b97070 65%, #c4887a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 72px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -120, right: -120,
          width: 420, height: 420, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)', display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', display: 'flex',
        }} />

        {/* App name header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 44 }}>
          <span style={{ fontSize: 38 }}>🌸</span>
          <span style={{
            fontSize: 22, color: 'rgba(255,255,255,0.70)',
            fontWeight: 700, letterSpacing: '4px',
          }}>
            MY SKIN RECIPE
          </span>
        </div>

        {/* Recipe name */}
        <div style={{
          fontSize: name.length > 14 ? 52 : 64,
          fontWeight: 900,
          color: 'white',
          lineHeight: 1.1,
          marginBottom: 20,
          display: 'flex',
          letterSpacing: '-1px',
          maxWidth: 900,
        }}>
          {name}
        </div>

        {/* Skin type badge */}
        <div style={{ display: 'flex', marginBottom: 44 }}>
          <div style={{
            paddingLeft: 22, paddingRight: 22, paddingTop: 11, paddingBottom: 11,
            background: 'rgba(255,255,255,0.18)',
            borderRadius: 50,
            color: 'rgba(255,255,255,0.92)',
            fontSize: 22, fontWeight: 600,
            display: 'flex',
          }}>
            {skin}
          </div>
        </div>

        {/* Ingredient chips */}
        {ingList.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {ingList.map((ing) => (
              <div key={ing} style={{
                paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
                background: 'rgba(255,255,255,0.13)',
                borderRadius: 50,
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', borderStyle: 'solid',
                color: 'white',
                fontSize: 19, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>🧪</span>
                <span>{ing}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom left: URL */}
        <div style={{
          position: 'absolute', bottom: 48, left: 72,
          fontSize: 19, color: 'rgba(255,255,255,0.55)', fontWeight: 500,
          display: 'flex',
        }}>
          skin-recipe-app.vercel.app
        </div>

        {/* Bottom right: CTA button */}
        <div style={{
          position: 'absolute', bottom: 40, right: 72,
          paddingLeft: 28, paddingRight: 28, paddingTop: 14, paddingBottom: 14,
          background: 'white',
          borderRadius: 50,
          color: '#b97070',
          fontSize: 20, fontWeight: 800,
          display: 'flex',
        }}>
          내 레시피 찾기 →
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
