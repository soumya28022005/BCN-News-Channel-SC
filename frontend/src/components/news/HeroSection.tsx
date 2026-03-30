import Link from 'next/link';
import { timeAgo } from '../../lib/utils';
import ArticleCard from './ArticleCard';

interface HeroSectionProps {
  featured: any;
  secondary: any[];
  articles?: any[]; // Added to support the new slider from ChatGPT
}

export default function HeroSection({ featured, secondary, articles = [] }: HeroSectionProps) {
  if (!featured) return null;

  // Fallback to secondary articles if an explicit "articles" array isn't passed yet
  const scrollableArticles = articles.length > 0 ? articles : secondary;

  return (
    <section style={{ marginBottom: '2.5rem' }}>

      {/* ── Main grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px',
        }}
        className="lg:!grid-cols-[1fr_360px]"
      >

        {/* ── Featured hero ── */}
        <div>
          <Link
            href={`/news/${featured.slug}`}
            className="group hero-glow"
            style={{
              display: 'block',
              borderRadius: 16,
              overflow: 'hidden',
              position: 'relative',
              textDecoration: 'none',
              background: 'var(--bg2)',
            }}
          >
            {/* Image */}
            <div
              style={{
                height: 'clamp(260px, 42vw, 460px)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {featured.thumbnail ? (
                <img
                  src={featured.thumbnail}
                  alt={featured.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s ease',
                    display: 'block',
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
                    background: 'linear-gradient(135deg, #0C1830 0%, #071022 100%)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '5rem',
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      color: 'rgba(201,168,76,0.12)',
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    BCN
                  </span>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="img-overlay" style={{ position: 'absolute', inset: 0 }} />

              {/* ── Content overlay ── */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 'clamp(16px, 4vw, 32px)',
                }}
              >
                {/* Top badges row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  {featured.isBreaking && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        background: '#B91C1C',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        padding: '4px 10px',
                        borderRadius: 4,
                        textTransform: 'uppercase',
                      }}
                    >
                      <span
                        className="live-dot inline-block rounded-full"
                        style={{ width: 6, height: 6, background: '#fff' }}
                      />
                      ব্রেকিং
                    </span>
                  )}

                  {featured.category && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.09em',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: 4,
                        background: 'rgba(201,168,76,0.15)',
                        color: 'var(--gold)',
                        border: '1px solid rgba(201,168,76,0.30)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {featured.category.name}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1
                  style={{
                    fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    lineHeight: 1.3,
                    marginBottom: 10,
                    fontFamily: "'Playfair Display', serif",
                    transition: 'color 0.2s',
                    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  }}
                  className="group-hover:text-[var(--gold)]"
                >
                  {featured.title}
                </h1>

                {/* Excerpt */}
                {featured.excerpt && (
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.70)',
                      lineHeight: 1.6,
                      marginBottom: 14,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {featured.excerpt}
                  </p>
                )}

                {/* Meta bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    flexWrap: 'wrap',
                  }}
                >
                  {featured.author?.name && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.65)',
                      }}
                    >
                      {/* Author mini-avatar */}
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'var(--gold)',
                          color: '#0A0C0B',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '9px',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {featured.author.name[0]}
                      </span>
                      {featured.author.name}
                    </span>
                  )}

                  <span
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.5)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {timeAgo(featured.publishedAt || featured.createdAt)}
                  </span>

                  {featured.viewCount != null && (
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: "'JetBrains Mono', monospace",
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      {Number(featured.viewCount).toLocaleString('bn-BD')}
                    </span>
                  )}

                  {/* Read more pill */}
                  <span
                    style={{
                      marginLeft: 'auto',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '5px 14px',
                      borderRadius: 20,
                      background: 'var(--gold)',
                      color: '#0A0C0B',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.03em',
                      transition: 'background 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    পড়ুন
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* ── Secondary articles ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {/* Section label */}
          <div style={{ marginBottom: '4px' }}>
            <h2
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 18,
                  height: 2,
                  background: 'var(--gold)',
                  borderRadius: 1,
                }}
              />
              সাম্প্রতিক খবর
              <span
                style={{
                  display: 'inline-block',
                  flex: 1,
                  height: 1,
                  background: 'var(--gold-line)',
                }}
              />
            </h2>
          </div>

          {secondary.map((article: any) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="horizontal"
            />
          ))}

          {/* View all link */}
          <Link
            href="/trending"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px',
              borderRadius: 10,
              border: '1px solid var(--gold-border)',
              color: 'var(--gold)',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.03em',
              background: 'var(--gold-dim)',
              textDecoration: 'none',
              transition: 'background 0.2s, border-color 0.2s',
              marginTop: 4,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(201,168,76,0.18)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'var(--gold-dim)';
            }}
          >
            সব খবর দেখুন
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ── ADDED BY CHATGPT: Horizontal Scrollable Articles ── */}
      {scrollableArticles && scrollableArticles.length > 0 && (
        <div className="mt-4 overflow-x-auto flex gap-3 pb-2 custom-scrollbar">
          {scrollableArticles.slice(0, 10).map((a: any) => (
            <Link
              key={a.id}
              href={`/news/${a.slug}`}
              className="shrink-0"
              style={{
                minWidth: 140,
                maxWidth: 180, // Optional constraint so they don't get too wide
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '10px',
                textDecoration: 'none'
              }}
            >
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--text)',
                lineHeight: 1.4,
                margin: 0, // Cleared margin to prevent layout breaks inside card
                display: '-webkit-box',
                WebkitLineClamp: 3, // Prevents overly tall cards
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {a.title}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* ── Gold divider ── */}
      <div className="gold-line" style={{ marginTop: '2rem', opacity: 0.5 }} />
      
    </section>
  );
}