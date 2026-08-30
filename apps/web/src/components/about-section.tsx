export function AboutSection() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:py-16">
      <h2 className="sr-only">Om Näthänget</h2>
      <blockquote className="text-lg leading-relaxed text-foreground/90 sm:text-xl">
        <span className="text-cyan">Näthänget är mötesplatsen</span> där du kan{" "}
        <span className="text-cyan">vara dig själv</span> – utan filter, utan press och{" "}
        <span className="text-cyan">utan att jaga likes</span>.{" "}
        <em className="font-semibold not-italic text-foreground">
          Tänk dig känslan av att cykla hem till kompisarna på sommarlovet, sitta i lägerelden och
          prata om allt mellan himmel och jord, eller skicka hemliga lappar fram och tillbaka.
        </em>{" "}
        Det handlar om <span className="text-cyan">riktiga samtal</span>, gemensamma intressen och
        äkta vänskap – precis som förr. Skriv i din gästbok,{" "}
        <span className="text-cyan">dela tankar på klotterplanket</span>, skicka flaskpost till dina
        vänner eller <span className="text-cyan">hitta</span> någon nära dig på Träffpunkten.
      </blockquote>
    </section>
  );
}
