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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-navy mb-8">{t('title')}</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">{t('story')}</h2>
        <p className="text-gray-600 leading-relaxed">{t('storyText')}</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="card p-6">
          <h2 className="text-xl font-heading font-bold text-primary mb-3">{t('mission')}</h2>
          <p className="text-gray-600">{t('missionText')}</p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-heading font-bold text-primary mb-3">{t('vision')}</h2>
          <p className="text-gray-600">{t('visionText')}</p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-heading font-bold text-navy mb-6">{t('categories')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.key} className="card p-4 text-center">
                <Icon className={`w-10 h-10 mx-auto mb-2 ${cat.color}`} />
                <p className="font-medium">{tc(cat.key)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-heading font-bold text-navy mb-6">{t('toxicity')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {toxicity.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className={`card p-6 border-2 ${item.color}`}>
                <Icon className="w-10 h-10 mb-3" />
                <h3 className="font-heading font-bold text-lg mb-2">{t(item.key)}</h3>
                <p className="text-sm">{t(`${item.key}Desc`)}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
