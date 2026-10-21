import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ExplorationProvider } from '@/context/ExplorationContext';

export const metadata: Metadata = {
  title: 'NeuroLearn Studio — Deep Learning & Machine Learning Interactif',
  description:
    'Plateforme éducative et de présentation pour le module Deep Learning : nettoyage de données, prétraitement, équilibrage SMOTE, algorithmes ML, métriques, réseaux de neurones 3D et CNN from scratch.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark scroll-smooth">
      <body className="bg-background text-foreground min-h-screen flex flex-col selection:bg-cyan-500 selection:text-slate-950">
        <ExplorationProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </ExplorationProvider>
      </body>
    </html>
  );
}
