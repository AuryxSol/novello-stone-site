document.addEventListener('DOMContentLoaded', () => {
  const catalogueRoot = document.querySelector('[data-material-catalogue]');
  if (!catalogueRoot) return;

  const materials = [
    { family: 'marble', type: 'Metamorphic', name: 'Alpine Cloud', image: 'marble012.webp', tone: 'pale grey white clouded', note: 'Soft mineral clouding for calm, light-filled interiors.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'shower-walls', 'feature-walls', 'fireplaces', 'reception', 'furniture'] },
    { family: 'marble', type: 'Metamorphic', name: 'Nero Thread', image: 'marble016.webp', tone: 'black charcoal fine white vein', note: 'A deep charcoal field crossed by fine, energetic veins.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'feature-walls', 'fireplaces', 'reception', 'bars', 'furniture'] },
    { family: 'marble', type: 'Metamorphic', name: 'Gallery White', image: 'marble021.webp', tone: 'bright white subtle polished', note: 'A restrained pale surface for seamless architectural spaces.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'shower-walls', 'feature-walls', 'reception', 'retail', 'furniture'] },
    { family: 'marble', type: 'Metamorphic', name: 'Graphite Vein', image: 'marble006.webp', tone: 'graphite grey dark natural', note: 'Layered grey movement with a grounded, contemporary presence.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'feature-walls', 'fireplaces', 'reception', 'bars', 'furniture'] },
    { family: 'marble', type: 'Metamorphic', name: 'Warm Fossil', image: 'marble014.webp', tone: 'beige cream warm subtle', note: 'Warm cream and stone tones with quiet, organic variation.', apps: ['worktops', 'splashbacks', 'vanities', 'shower-walls', 'feature-walls', 'fireplaces', 'flooring', 'reception'] },
    { family: 'marble', type: 'Metamorphic', name: 'Sanded Pearl', image: 'marble020.webp', tone: 'sand pearl beige reflective', note: 'A soft pearl-beige direction with a refined polished character.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'feature-walls', 'fireplaces', 'reception', 'furniture'] },

    { family: 'granite', type: 'Igneous', name: 'Salt & Pepper', image: 'granite002a.webp', tone: 'white grey black speckled', note: 'Classic fine-grain contrast built for hardworking surfaces.', apps: ['worktops', 'islands', 'vanities', 'flooring', 'stairs', 'fireplaces', 'reception', 'bars', 'outdoor-kitchens', 'patios', 'facades'] },
    { family: 'granite', type: 'Igneous', name: 'Silver Grain', image: 'granite002b.webp', tone: 'silver grey mineral speckled', note: 'Cool silver aggregate with even, dependable visual rhythm.', apps: ['worktops', 'islands', 'vanities', 'flooring', 'stairs', 'fireplaces', 'reception', 'retail', 'outdoor-kitchens', 'patios', 'facades'] },
    { family: 'granite', type: 'Igneous', name: 'Mineral Mist', image: 'granite001a.webp', tone: 'mist grey neutral fine grain', note: 'A balanced grey field that settles easily into busy rooms.', apps: ['worktops', 'islands', 'vanities', 'flooring', 'stairs', 'fireplaces', 'reception', 'bars', 'outdoor-kitchens', 'patios'] },
    { family: 'granite', type: 'Igneous', name: 'Blue Ash', image: 'granite005a.webp', tone: 'blue grey cool mineral', note: 'Blue-grey mineral depth for crisp contemporary schemes.', apps: ['worktops', 'islands', 'vanities', 'flooring', 'stairs', 'feature-walls', 'fireplaces', 'reception', 'outdoor-kitchens', 'facades'] },
    { family: 'granite', type: 'Igneous', name: 'Warm Fleck', image: 'granite005b.webp', tone: 'warm taupe brown grey fleck', note: 'Warm neutral grains that bridge timber, bronze and stone.', apps: ['worktops', 'islands', 'vanities', 'flooring', 'stairs', 'fireplaces', 'bars', 'outdoor-kitchens', 'patios'] },
    { family: 'granite', type: 'Igneous', name: 'Urban Grey', image: 'granite003a.webp', tone: 'urban grey dark fine grain', note: 'A practical mid-grey with a tailored commercial feel.', apps: ['worktops', 'islands', 'vanities', 'flooring', 'stairs', 'reception', 'retail', 'bars', 'outdoor-kitchens', 'facades'] },

    { family: 'quartzite', type: 'Metamorphic', name: 'Alpine Mist', image: 'quartzite-alpine-mist.webp', tone: 'white cream crystalline veined', note: 'Crystalline pale movement with the strength of natural quartzite.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'shower-walls', 'feature-walls', 'fireplaces', 'reception', 'bars', 'furniture', 'outdoor-kitchens'] },
    { family: 'quartzite', type: 'Metamorphic', name: 'Caribbean Blue', image: 'quartzite-caribbean-blue.webp', tone: 'blue green rust crystalline', note: 'Blue-green mineral movement with rust-coloured accents.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'feature-walls', 'fireplaces', 'reception', 'bars', 'furniture'] },

    { family: 'onyx', type: 'Banded calcite', name: 'Frosted Onyx', image: 'onyx015.webp', tone: 'white ivory translucent', note: 'Pale translucent bands suited to quiet feature lighting.', apps: ['vanities', 'splashbacks', 'feature-walls', 'fireplaces', 'reception', 'bars', 'retail', 'furniture'] },
    { family: 'onyx', type: 'Banded calcite', name: 'Noir Onyx', image: 'onyx013.webp', tone: 'black dark dramatic translucent', note: 'Dark, dramatic layers for intimate feature surfaces.', apps: ['vanities', 'splashbacks', 'feature-walls', 'fireplaces', 'reception', 'bars', 'retail', 'furniture'] },
    { family: 'onyx', type: 'Banded calcite', name: 'Silver Fold', image: 'onyx011.webp', tone: 'silver grey folded translucent', note: 'Silver-grey bands with a soft, folded movement.', apps: ['vanities', 'splashbacks', 'feature-walls', 'fireplaces', 'reception', 'bars', 'retail', 'furniture'] },
    { family: 'onyx', type: 'Banded calcite', name: 'Honey Current', image: 'onyx001.webp', tone: 'honey amber cream translucent', note: 'Warm amber currents designed to glow when backlit.', apps: ['vanities', 'splashbacks', 'feature-walls', 'fireplaces', 'reception', 'bars', 'retail', 'furniture'] },
    { family: 'onyx', type: 'Banded calcite', name: 'Ember Onyx', image: 'onyx010.webp', tone: 'red rust rose dramatic', note: 'Rust and rose bands for one decisive architectural moment.', apps: ['vanities', 'feature-walls', 'fireplaces', 'reception', 'bars', 'retail', 'furniture'] },

    { family: 'limestone', type: 'Sedimentary', name: 'Jura Warm', image: 'limestone-jura-warm.webp', tone: 'warm beige shell fossil', note: 'Fine fossil detail in an adaptable warm-beige field.', apps: ['vanities', 'shower-walls', 'feature-walls', 'flooring', 'stairs', 'fireplaces', 'reception', 'patios', 'facades'] },
    { family: 'limestone', type: 'Sedimentary', name: 'Belgian Blue', image: 'limestone-belgian-blue.webp', tone: 'black charcoal fossil shell', note: 'A dark fossil-rich surface with graphic natural inclusions.', apps: ['vanities', 'feature-walls', 'flooring', 'stairs', 'fireplaces', 'reception', 'retail', 'facades'] },
    { family: 'limestone', type: 'Sedimentary', name: 'Solnhofen Gold', image: 'limestone-solnhofen.webp', tone: 'gold ochre warm honed', note: 'Golden natural variation with a softly honed architectural feel.', apps: ['shower-walls', 'feature-walls', 'flooring', 'stairs', 'fireplaces', 'patios', 'pool-surrounds', 'facades'] },
    { family: 'limestone', type: 'Sedimentary', name: 'Fossil Cream', image: 'limestone-fossil-cream.webp', tone: 'cream gold grey natural', note: 'Cream and warm-grey fragments for tactile, relaxed spaces.', apps: ['vanities', 'feature-walls', 'flooring', 'stairs', 'fireplaces', 'reception', 'patios', 'facades'] },

    { family: 'travertine', type: 'Sedimentary', name: 'Ivory Linear', image: 'travertine009.webp', tone: 'ivory cream linear', note: 'Pale horizontal movement for calm, continuous planes.', apps: ['vanities', 'shower-walls', 'feature-walls', 'flooring', 'stairs', 'fireplaces', 'reception', 'patios', 'pool-surrounds', 'facades'] },
    { family: 'travertine', type: 'Sedimentary', name: 'Walnut Vein', image: 'travertine005.webp', tone: 'walnut brown linear dark', note: 'Deep walnut banding with a strong vein-cut expression.', apps: ['vanities', 'feature-walls', 'flooring', 'stairs', 'fireplaces', 'reception', 'bars', 'patios', 'facades'] },
    { family: 'travertine', type: 'Sedimentary', name: 'Silver Cut', image: 'travertine004.webp', tone: 'silver grey linear', note: 'Cool linear grain for restrained modern architecture.', apps: ['vanities', 'shower-walls', 'feature-walls', 'flooring', 'stairs', 'fireplaces', 'reception', 'patios', 'pool-surrounds', 'facades'] },
    { family: 'travertine', type: 'Sedimentary', name: 'Mocha Cross-Cut', image: 'travertine003.webp', tone: 'mocha beige cloudy cross cut', note: 'Clouded cross-cut movement in a warm mocha palette.', apps: ['vanities', 'shower-walls', 'feature-walls', 'flooring', 'stairs', 'fireplaces', 'reception', 'patios'] },
    { family: 'travertine', type: 'Sedimentary', name: 'Blue Ash Travertine', image: 'travertine013.webp', tone: 'blue grey layered linear', note: 'Blue-grey banding with a cooler, gallery-like atmosphere.', apps: ['vanities', 'feature-walls', 'flooring', 'stairs', 'fireplaces', 'reception', 'retail', 'facades'] },

    { family: 'engineered', type: 'Composite surface', name: 'Pale Cloud', image: 'engineered-pale-cloud.webp', tone: 'white pale subtle engineered', note: 'Controlled pale movement for consistent, low-fuss interiors.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'feature-walls', 'reception', 'retail', 'bars', 'furniture'] },
    { family: 'engineered', type: 'Composite surface', name: 'Charcoal Vein', image: 'engineered-charcoal-vein.webp', tone: 'charcoal black dark engineered', note: 'A dark engineered direction for precise contemporary joinery.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'feature-walls', 'reception', 'retail', 'bars', 'furniture'] },

    { family: 'porcelain', type: 'Sintered ceramic', name: 'Clean White Porcelain', image: 'marble021.webp', tone: 'clean white pale subtle porcelain', note: 'A pale stone-look direction available across South African large-format porcelain ranges.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'shower-walls', 'feature-walls', 'flooring', 'fireplaces', 'reception', 'retail', 'furniture', 'outdoor-kitchens', 'facades'] },
    { family: 'porcelain', type: 'Sintered ceramic', name: 'Cloud Grey Porcelain', image: 'marble012.webp', tone: 'soft grey white cloudy porcelain', note: 'A softly clouded direction with locally obtainable options for interior and exterior use.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'shower-walls', 'feature-walls', 'flooring', 'fireplaces', 'reception', 'retail', 'furniture', 'outdoor-kitchens', 'facades'] },
    { family: 'porcelain', type: 'Sintered ceramic', name: 'Veined Black Porcelain', image: 'marble016.webp', tone: 'veined nero black charcoal porcelain', note: 'A dark veined direction represented in current South African porcelain collections.', apps: ['worktops', 'islands', 'splashbacks', 'vanities', 'shower-walls', 'feature-walls', 'flooring', 'fireplaces', 'reception', 'retail', 'bars', 'outdoor-kitchens', 'facades'] },

    { family: 'terrazzo', type: 'Composite surface', name: 'Confetti White', image: 'terrazzo013.webp', tone: 'white colourful confetti aggregate', note: 'Playful multicolour aggregate held in a crisp white base.', apps: ['worktops', 'vanities', 'shower-walls', 'feature-walls', 'flooring', 'stairs', 'reception', 'retail', 'bars', 'furniture'] },
    { family: 'terrazzo', type: 'Composite surface', name: 'Rosé Aggregate', image: 'terrazzo018.webp', tone: 'rose pink warm colourful aggregate', note: 'Warm blush and mineral fragments for expressive public spaces.', apps: ['worktops', 'vanities', 'shower-walls', 'feature-walls', 'flooring', 'stairs', 'reception', 'retail', 'bars', 'furniture'] },
    { family: 'terrazzo', type: 'Composite surface', name: 'Monochrome Chip', image: 'terrazzo005.webp', tone: 'black white monochrome aggregate', note: 'Graphic black-and-white aggregate with a tailored rhythm.', apps: ['worktops', 'vanities', 'shower-walls', 'feature-walls', 'flooring', 'stairs', 'reception', 'retail', 'bars', 'furniture'] },
    { family: 'terrazzo', type: 'Composite surface', name: 'Classic Cream', image: 'terrazzo004.webp', tone: 'cream warm neutral aggregate', note: 'A quiet warm-neutral terrazzo for timeless shared spaces.', apps: ['worktops', 'vanities', 'shower-walls', 'feature-walls', 'flooring', 'stairs', 'reception', 'retail', 'bars', 'furniture'] },
    { family: 'terrazzo', type: 'Composite surface', name: 'Mineral Beige', image: 'terrazzo019l.webp', tone: 'beige mineral natural aggregate', note: 'Fine mineral aggregate in an understated sandy base.', apps: ['worktops', 'vanities', 'shower-walls', 'feature-walls', 'flooring', 'stairs', 'reception', 'retail', 'bars', 'furniture'] },
  ];

  const familyInfo = {
    all: {
      title: 'A working palette, not a stock promise.',
      copy: 'Browse natural stone, engineered surfaces and sintered materials by visual direction or by where you want to use them. Every family shown has an established South African supply route.',
      origin: 'Sourced globally and specified locally for the Garden Route.',
      local: 'SA SOURCING VERIFIED · EXACT PRODUCT, LIVE STOCK, SLAB, BATCH AND FINISH CONFIRMED BEFORE QUOTATION.',
    },
    marble: { title: 'Marble', copy: 'Expressive natural stone with veining that ranges from restrained to dramatic. Best where character matters and routine care is understood.', origin: 'Commonly sourced from Italy, Turkey, Greece, Spain and Portugal.', local: 'SA SUPPLY ROUTE · RUDI’S CHOICE, WOMAG AND ARTMAR.' },
    granite: { title: 'Granite', copy: 'Dense igneous stone with granular movement, strong heat resistance and excellent durability for demanding surfaces.', origin: 'Commonly sourced from Southern Africa, India, Brazil, Zimbabwe and Norway.', local: 'SA SUPPLY ROUTE · RUDI’S CHOICE, WOMAG AND ARTMAR.' },
    quartzite: { title: 'Quartzite', copy: 'Natural stone formed from sandstone under intense heat and pressure, combining crystalline movement with excellent hardness.', origin: 'Commonly sourced from Brazil, India, the United States and Norway.', local: 'SA SUPPLY ROUTE · RUDI’S CHOICE, WOMAG AND ARTMAR.' },
    onyx: { title: 'Onyx', copy: 'Decorative banded stone prized for translucency and movement. Best used as a protected feature, often with considered backlighting.', origin: 'Commonly sourced from Turkey, Iran, Pakistan and Mexico.', local: 'SA SUPPLY ROUTE · RUDI’S CHOICE, WOMAG AND ARTMAR.' },
    limestone: { title: 'Limestone', copy: 'Warm sedimentary stone with a softer, quieter texture. Finish and sealing are selected around traffic, moisture and exposure.', origin: 'Commonly sourced from Portugal, France, Italy, Spain and local Southern African suppliers.', local: 'SA SUPPLY ROUTE · WOMAG AND ARTMAR.' },
    travertine: { title: 'Travertine', copy: 'A mineral-rich limestone recognised by linear pores and layered movement, available vein-cut or cross-cut.', origin: 'Commonly sourced from Italy, Turkey, Iran and Peru.', local: 'SA SUPPLY ROUTE · RUDI’S CHOICE, WOMAG AND ARTMAR.' },
    engineered: { title: 'Engineered Stone', copy: 'A consistent composite surface that suits precise interior joinery and everyday work areas. Brand-specific technical guidance always applies.', origin: 'Manufactured in multiple regions; exact composition and warranty vary by maker.', local: 'SA SUPPLY ROUTE · INTERSLAB, WOMAG AND COSENTINO SOUTH AFRICA.' },
    porcelain: { title: 'Large-Format Porcelain', copy: 'A dense sintered ceramic surface with broad colour control, low porosity and options for interior or exterior use.', origin: 'Manufactured globally; formats, print depth and technical ratings vary by range.', local: 'SA SUPPLY ROUTE · INFINITY SURFACES / INTERSLAB, WOMAG AND COSENTINO SOUTH AFRICA.' },
    terrazzo: { title: 'Terrazzo', copy: 'Marble or mineral aggregate set into cementitious or resin binders, offering colour control and a distinctly crafted pattern.', origin: 'Made internationally and locally; binder, chip size and installation system determine use.', local: 'SA SUPPLY ROUTE · UNION TILES / TERRA-STONE, NOTATION DESIGN AND WOMAG.' },
  };

  const applicationLabels = {
    all: 'All applications', worktops: 'Kitchen worktops', islands: 'Kitchen islands', splashbacks: 'Splashbacks', vanities: 'Bathroom vanities',
    'shower-walls': 'Shower & bath walls', 'feature-walls': 'Feature walls', fireplaces: 'Fireplaces', flooring: 'Flooring', stairs: 'Stairs',
    reception: 'Reception desks', retail: 'Retail counters', bars: 'Bars & hospitality', furniture: 'Tables, shelving & furniture',
    'outdoor-kitchens': 'Outdoor kitchens', patios: 'Patios', 'pool-surrounds': 'Pool surrounds', facades: 'Exterior façades',
  };

  const familyLabels = {
    marble: 'Marble', granite: 'Granite', quartzite: 'Quartzite', onyx: 'Onyx', limestone: 'Limestone', travertine: 'Travertine',
    engineered: 'Engineered Stone', porcelain: 'Porcelain', terrazzo: 'Terrazzo',
  };

  const grid = catalogueRoot.querySelector('[data-palette-grid]');
  const count = catalogueRoot.querySelector('[data-palette-count]');
  const empty = catalogueRoot.querySelector('[data-palette-empty]');
  const search = catalogueRoot.querySelector('[data-palette-search]');
  const application = catalogueRoot.querySelector('[data-application-filter]');
  const familyButtons = [...catalogueRoot.querySelectorAll('[data-family-filter]')];
  const summary = catalogueRoot.querySelector('[data-family-summary]');
  let activeFamily = 'all';

  const normalise = (value) => value.toLowerCase().trim();

  function render() {
    const query = normalise(search.value);
    const activeApplication = application.value;
    const visible = materials.filter((material) => {
      const familyMatch = activeFamily === 'all' || material.family === activeFamily;
      const applicationMatch = activeApplication === 'all' || material.apps.includes(activeApplication);
      const haystack = normalise(`${material.name} ${familyLabels[material.family]} ${material.type} ${material.tone} ${material.note} ${material.apps.map((app) => applicationLabels[app]).join(' ')}`);
      return familyMatch && applicationMatch && (!query || haystack.includes(query));
    });

    grid.innerHTML = visible.map((material, index) => {
      const displayedUses = material.apps.slice(0, 4).map((app) => `<li>${applicationLabels[app]}</li>`).join('');
      const remaining = material.apps.length - 4;
      return `
        <article class="surface-card" data-surface-card>
          <div class="surface-card__image-wrap">
            <img src="img/catalogue/${material.image}" alt="${material.name} ${familyLabels[material.family]} surface inspiration close-up" loading="lazy" width="900" height="900">
            <span class="surface-card__number">${String(index + 1).padStart(2, '0')}</span>
          </div>
          <div class="surface-card__body">
            <span class="surface-card__family">${material.type} / ${familyLabels[material.family]}</span>
            <h3>${material.name}</h3>
            <p>${material.note}</p>
            <div class="surface-card__sourcing" aria-label="South African sourcing status">
              <span aria-hidden="true">&#10003;</span>
              <strong>SA supply route verified</strong>
            </div>
            <div class="surface-card__uses-wrap">
              <span class="surface-card__uses-label">Suitable for</span>
              <ul class="surface-card__uses">${displayedUses}${remaining > 0 ? `<li>+${remaining} more</li>` : ''}</ul>
            </div>
          </div>
        </article>`;
    }).join('');

    count.textContent = `${visible.length} surface ${visible.length === 1 ? 'direction' : 'directions'}`;
    empty.hidden = visible.length !== 0;
    grid.hidden = visible.length === 0;

    const info = familyInfo[activeFamily];
    summary.innerHTML = `<span class="mono">${activeFamily === 'all' ? 'THE NOVELLO PALETTE' : familyLabels[activeFamily].toUpperCase()}</span><h3>${info.title}</h3><div class="material-family-copy"><p>${info.copy}</p><p class="material-origin">${info.origin}</p><p class="material-local-route">${info.local}</p></div>`;
  }

  familyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFamily = button.dataset.familyFilter;
      familyButtons.forEach((control) => control.setAttribute('aria-pressed', String(control === button)));
      render();
    });
  });
  application.addEventListener('change', render);
  search.addEventListener('input', render);
  render();
});
