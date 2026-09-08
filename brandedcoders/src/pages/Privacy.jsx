import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataStore } from '../lib/dataStore';

export default function Privacy() {
  const [content, setContent] = useState(dataStore.getSiteContent().privacyPolicy);

  useEffect(() => {
    return dataStore.subscribe(() => {
      setContent(dataStore.getSiteContent().privacyPolicy);
    });
  }, []);

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 840 }}>
        <div style={{ marginBottom: 24 }}>
          <Link to="/" style={{ color: 'var(--accent)', fontSize: '0.88rem', fontWeight: 600 }}>
            ← Back to Home
          </Link>
        </div>

        <div className="panel-card" style={{ padding: '40px 48px', lineHeight: 1.8 }}>
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--ink)' }}>
            {content}
          </div>
        </div>
      </div>
    </section>
  );
}
