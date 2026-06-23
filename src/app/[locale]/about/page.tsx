import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { Bug, Shield, Sprout, FlaskConical, AlertTriangle, AlertOctagon, Skull } from 'lucide-react';

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tc = await getTranslations('categories');

  const categories = [
    { key: 'insecticide', icon: Bug, color: 'text-insecticide' },
    { key: 'fungicide', icon: Shield, color: 'text-fungicide' },
    { key: 'herbicide', icon: Sprout, color: 'text-herbicide' },
    { key: 'pgr', icon: FlaskConical, color: 'text-pgr' },
  ];

  const toxicity = [
    { key: 'caution', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { key: 'danger', icon: AlertOctagon, color: 'bg-orange-100 text-orange-700 border-orange-300' },
    { key: 'poison', icon: Skull, color: 'bg-red-100 text-red-700 border-red-300' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <div className="bg-gradient-navy text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-white/80 max-w-2xl">{t('subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Company Story */}
        <section className="mb-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-heading font-bold text-navy-900 mb-6">{t('story')}</h2>
            <p className="text-lg text-ink/70 leading-relaxed">{t('storyText')}</p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-accent-100 border border-accent-500/30 rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold text-navy-900 mb-4">{t('mission')}</h2>
              <p className="text-ink/70 leading-relaxed">{t('missionText')}</p>
            </div>
            <div className="bg-gradient-navy text-white rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">{t('vision')}</h2>
              <p className="text-white/80 leading-relaxed">{t('visionText')}</p>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="mb-20">
          <h2 className="text-3xl font-heading font-bold text-navy-900 mb-10">{t('categories')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.key} className="card p-6 text-center hover:shadow-card-hover transition-all">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-surface rounded-lg mb-4">
                    <Icon className={`w-8 h-8 ${cat.color}`} />
                  </div>
                  <p className="font-heading font-bold text-navy-900">{tc(cat.key)}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Toxicity Classification */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-navy-900 mb-10">{t('toxicity')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {toxicity.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className={`card p-8 border-2 ${item.color}`}>
                  <Icon className="w-12 h-12 mb-4" />
                  <h3 className="font-heading font-bold text-lg mb-3">{t(item.key)}</h3>
                  <p className="text-sm leading-relaxed">{t(`${item.key}Desc`)}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
