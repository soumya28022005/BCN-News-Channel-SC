import Link from 'next/link';
import { timeAgo } from '../../lib/utils';

interface ArticleCardProps {
  article: any;
  variant?: 'default' | 'horizontal' | 'minimal';
  rank?: number; // for trending lists
}

// Rough reading time estimate (Bengali avg ~120 wpm)
function readingTime(text?: string): string {
  if (!text) return '';
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 120));
  return `${mins} মিনিট`;
}

export default function ArticleCard({ article, variant = 'default', rank }: ArticleCardProps) {

  // ── HORIZONTAL ─────────────────────────────────────────────────────────
  if (variant === 'horizontal') {
    return (
      <Link
        href={`/news/${article.slug}`}
        className="group"
        style={{
          display: 'flex',
          gap: '12px',
          padding: '12px',
          borderRadius: '10px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
          textDecoration: 'none',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'var(--gold-border)';
          el.style.boxShadow   = 'var(--shadow-md)';
          el.style.transform   = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'var(--border)';
          el.style.boxShadow   = 'none';
          el.style.transform   = 'translateY(0)';
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            width: 88,
            height: 72,
            flexShrink: 0,
            borderRadius: 8,
            overflow: 'hidden',
            background: 'var(--bg3)',
            position: 'relative',
          }}
        >
          {article.thumbnail ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.35s ease',
              }}
              className="group-hover:scale-105"
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--muted2)',
                background: 'linear-gradient(135deg, var(--bg3), var(--bg4))',
              }}
            >
              BCN
            </div>
          )}

          {/* Breaking overlay */}
          {article.isBreaking && (
            <div
              style={{
                position: 'absolute',
                top: 4,
                left: 4,
                background: 'var(--accent-red)',
                color: '#fff',
                fontSize: '8px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                padding: '2px 5px',
                borderRadius: 3,
              }}
            >
              LIVE
            </div>
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Category */}
          {article.category && (
            <span className="cat-badge">
              {article.category.name}
            </span>
          )}

          {/* Title */}
          <h3
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              lineHeight: 1.45,
              color: 'var(--text)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 0.2s',
              fontFamily: "'Playfair Display', serif",
            }}
            className="group-hover:text-[var(--gold)]"
          >
            {article.title}
          </h3>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}>
            <span
              style={{
                fontSize: '10px',
                color: 'var(--muted2)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {timeAgo(article.publishedAt || article.createdAt)}
            </span>
            {article.content && (
              <>
                <span style={{ color: 'var(--muted2)', fontSize: '10px' }}>·</span>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--muted2)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {readingTime(article.content)}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // ── MINIMAL ─────────────────────────────────────────────────────────────
  if (variant === 'minimal') {
    return (
      <Link
        href={`/news/${article.slug}`}
        className="group"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '12px 0',
          borderBottom: '1px solid var(--border-light)',
          textDecoration: 'none',
        }}
      >
        {/* Rank badge */}
        {rank !== undefined && (
          <span
            className={`trend-number ${
              rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-n'
            }`}
            style={{ marginTop: 2 }}
          >
            {rank}
          </span>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {article.category && (
            <span className="cat-badge" style={{ marginBottom: 4, display: 'inline-block' }}>
              {article.category.name}
            </span>
          )}

          <h4
            style={{
              fontSize: '0.84rem',
              lineHeight: 1.5,
              color: 'var(--text)',
              transition: 'color 0.2s',
              fontFamily: "'Playfair Display', serif",
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            className="group-hover:text-[var(--gold)]"
          >
            {article.title}
          </h4>

          <p
            style={{
              fontSize: '10px',
              marginTop: 5,
              color: 'var(--muted2)',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {timeAgo(article.publishedAt || article.createdAt)}
          </p>
        </div>
      </Link>
    );
  }

  // ── DEFAULT (grid card) ──────────────────────────────────────────────────
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group card-hover"
      style={{
        display: 'block',
        borderRadius: 14,
        overflow: 'hidden',
        textDecoration: 'none',
      }}
    >
      {/* Image */}
      <div
        style={{
          height: 180,
          overflow: 'hidden',
          background: 'var(--bg3)',
          position: 'relative',
        }}
      >
        {article.thumbnail ? (
          <img
            src={article.thumbnail}
            alt={article.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            className="group-hover:scale-105"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0C1830, #0D1F4A)',
            }}
          >
            <span
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                letterSpacing: '0.1em',
                color: 'rgba(201,168,76,0.15)',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              BCN
            </span>
          </div>
        )}

        {/* Top badges overlay */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            display: 'flex',
            gap: 6,
            alignItems: 'center',
          }}
        >
          {article.isBreaking && (
            <span className="breaking-badge">
              <span
                className="live-dot inline-block rounded-full"
                style={{ width: 5, height: 5, background: '#fff', flexShrink: 0 }}
              />
              ব্রেকিং
            </span>
          )}
        </div>

        {/* Category chip — bottom left of image */}
        {article.category && (
          <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                padding: '3px 9px',
                borderRadius: 4,
                background: 'rgba(7,15,34,0.75)',
                color: 'var(--gold)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(201,168,76,0.25)',
              }}
            >
              {article.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        {/* Title */}
        <h3
          style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            lineHeight: 1.45,
            color: 'var(--text)',
            marginBottom: 8,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            transition: 'color 0.2s',
            fontFamily: "'Playfair Display', serif",
          }}
          className="group-hover:text-[var(--gold)]"
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p
            style={{
              fontSize: '0.78rem',
              lineHeight: 1.6,
              color: 'var(--muted)',
              marginBottom: 12,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.excerpt}
          </p>
        )}

        {/* Footer meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 10,
            borderTop: '1px solid var(--border-light)',
          }}
        >
          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Author avatar placeholder */}
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--gold-dim)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 700,
                color: 'var(--gold)',
                flexShrink: 0,
              }}
            >
              {article.author?.name?.[0] || 'B'}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--muted)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {article.author?.name || 'BCN'}
            </span>
          </div>

          {/* Time + views */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: '10px',
                color: 'var(--muted2)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {timeAgo(article.publishedAt || article.createdAt)}
            </span>
            {article.viewCount != null && (
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--muted2)',
                  fontFamily: "'JetBrains Mono', monospace",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                {Number(article.viewCount).toLocaleString('bn-BD')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}