import DeepTimeScene from '@/components/DeepTimeScene';

export const metadata = {
  title: 'Deep Time'
};

export default function TimelinePage() {
  return (
    <main style={{ height: '500vh' }}>
      <div id="timeline" style={{ position: 'sticky', top: 0, height: '100vh' }}>
        <DeepTimeScene />
      </div>
    </main>
  );
}
