import ParchmentShader from './ParchmentShader';

export default function ArtifactPlate({ artifact }) {
  return (
    <ParchmentShader className="artifact-card max-w-2xl mx-auto my-8">
      <div className="p-8 border-2 border-[#3d2b1f] bg-white/20">
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
          Ref. ID: {artifact.id} // Loc: {artifact.slug}
        </span>
        <h2
          className="text-3xl font-display mt-2 mb-4 border-b border-stone-400 pb-2"
          dangerouslySetInnerHTML={{ __html: artifact.title }}
        />
        <div className="w-full h-64 bg-stone-200 mb-4 overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-700">
          {artifact.image ? (
            <img src={artifact.image} alt={artifact.title} className="object-cover w-full h-full mix-blend-multiply" />
          ) : (
            <div className="flex items-center justify-center h-full italic text-stone-400">Sketch missing...</div>
          )}
        </div>
        <div
          className="font-body text-sm leading-relaxed text-justify first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left"
          dangerouslySetInnerHTML={{ __html: artifact.content }}
        />
      </div>
    </ParchmentShader>
  );
}
