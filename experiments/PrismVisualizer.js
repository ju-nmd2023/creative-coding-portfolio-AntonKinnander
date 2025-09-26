// References for the prism part

// Recreation of this prsim type art made by Tezumie using P5.js https://www.reddit.com/r/generative/comments/1n51jga/sketch_made_with_p5js/?show=original
// with help from this video for gradients https://www.youtube.com/watch?v=-MUOweQ6wac
// and this article to learn triangle subdivision  - https://www.tylerxhobbs.com/words/aesthetically-pleasing-triangle-subdivision

// visualizer references
// midi file sources bitmidi.com & freemidi.org
// midi to json converter https://tonejs.github.io/Midi/
// using tone js for audio like their examples https://github.com/Tonejs/Tone.js/

let midi = null;
let synths = [];
let isPlaying = false;
let audioAnalyser = null;
let currentIntensity = 0;
let currentTempo = 120;
let centerRadius = 100;
let radiusTarget = 100;

const midiFiles = [
  "Mii Channel.json",
  "All Star smash mouth.json",
  "Beethoven Moonlight Sonata.json",
  "Cool Cool Mountain.json",
  "MGMT - Kids.json",
  "Sans undertale.json",
  "Tokyo drift.json",
  "Pingu.json",
  "International Love.json",
  "Smash Mouth Im A Believer.json",
  "daft_punk-giorgio_by_moroder.json",
  "Gangnam Style.json",
  "Feel this moment.json",
  "var ska vi sova inatt perikles.json",
  "Timber.json",
  "Ma Baker.json",
  "What ive done.json",
  "Rasputin.json",
  "Crawling (linkin park).json",
  "Alphaville - Big in Japan.json",
  "Axel F.json",
  "My way frank sinatra.json",
  "Numb.json",
  "Maroon 5 - One more night.json",
  "Initial D - Rage Your Dream.json",
  "Hamster Dance.json",
  "Dreamscape.json",
  "David Guetta Kid Cudi - Memories.json",
  "Cry for you.json",
];
let currentMidiIndex = 0;

// visualizer
let m;
let isDone = false;
let depthLimit = 0;
let baseDepthLimit = 8;
let lastDepthLimit = 8; // to not redraw when not needed
let maxDepthLimit = 10;
let dividePoint;

// triangle colors
const primaryGradient = { start: [280, 90, 80], end: [320, 50, 60] }; // center
const secondaryGradient = { start: [300, 100, 0], end: [267, 100, 2] };
const highlightGradient = { start: [60, 100, 100], end: [30, 100, 80] };

let triangles = [];
let highlightedTriangles = new Map(); // Map of triangle -> expiration time
let lastHighPitchTime = 0; // Track when we last added highlights

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);

  m = 50;

  // stroke(0);

  pixelDensity(1);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noStroke();

  background(0);

  generateTriangles();

  // get audio ready
  setupAudioContext();

  createUIControls();
}

function draw() {
  background(0, 0, 0, 10);

  if (isPlaying && audioAnalyser) {
    updateAudioAnalysis();
  }

  // smooth circle animation
  centerRadius = lerp(centerRadius, radiusTarget, 0.1);

  depthLimit = baseDepthLimit + Math.floor(currentIntensity * 3);

  // only remake triangles when needed
  if (depthLimit !== lastDepthLimit && depthLimit <= maxDepthLimit) {
    generateTriangles();
    lastDepthLimit = depthLimit;
  }

  for (const triangle of triangles) {
    triangle.draw();
  }
}

class Triangle {
  constructor(side1, side2, side3) {
    this.side1 = side1;
    this.side2 = side2;
    this.side3 = side3;

    this.center = [
      (side1[0] + side2[0] + side3[0]) / 3,
      (side1[1] + side2[1] + side3[1]) / 3,
    ];

    //build in distancefrom center every time an triangle is built, had to ask ai to help me with this.
    //Could make it draw a circle static but not when triangles regenerated until this fix
    this.distanceFromCenter = dist(
      this.center[0],
      this.center[1],
      width / 2,
      height / 2
    );

    this.gradient = this.selectGradientByRadius();
  }

  selectGradientByRadius() {
    // remove dead highlight
    const now = performance.now();
    if (highlightedTriangles.has(this)) {
      if (now > highlightedTriangles.get(this)) {
        highlightedTriangles.delete(this);
      } else {
        return highlightGradient;
      }
    }

    return this.intersectsRadius() ? primaryGradient : secondaryGradient;
  }

  intersectsRadius() {
    const centerX = width / 2;
    const centerY = height / 2;

    //build in distancefrom center every time an triangle is built, ai added the distancefromcenter variable
    // before i onmly calculated this for the first triangles which was dumb
    if (this.distanceFromCenter <= centerRadius) {
      return true;
    }

    for (let vertex of [this.side1, this.side2, this.side3]) {
      const distance = dist(vertex[0], vertex[1], centerX, centerY);
      if (distance <= centerRadius) {
        return true;
      }
    }

    return false;
  }

  draw() {
    this.gradient = this.selectGradientByRadius();

    randomSeed(1);
    const gradientSize = random(20, 200);
    let gradient = drawingContext.createLinearGradient(
      this.center[0] - gradientSize,
      this.center[1] - gradientSize,
      this.center[0] + gradientSize,
      this.center[1] + gradientSize
    );

    const intensityFactor = 1 + currentIntensity * 0.5; //used for traingle subdivisons
    const [h1, s1, b1] = this.gradient.start;
    const [h2, s2, b2] = this.gradient.end;

    // HSB color pulse
    const modH1 = (h1 + currentIntensity * 20) % 360;
    const modH2 = (h2 + currentIntensity * 20) % 360;
    const modS1 = Math.min(100, s1 * Math.pow(intensityFactor, 2));
    const modS2 = Math.min(100, s2 * Math.pow(intensityFactor, 2));
    const modB1 = Math.min(100, b1 * Math.pow(intensityFactor, 2));
    const modB2 = Math.min(100, b2 * Math.pow(intensityFactor, 2));

    gradient.addColorStop(0, color(modH1, modS1, modB1));
    gradient.addColorStop(1, color(modH2, modS2, modB2));

    drawingContext.fillStyle = gradient;

    triangle(
      this.side1[0],
      this.side1[1],
      this.side2[0],
      this.side2[1],
      this.side3[0],
      this.side3[1]
    );
  }

  subdivide() {
    dividePoint = 0.2 + 0.4 * Math.random();
    const { pointA, pointB, opposite } = longestSideWithOpposite(
      this.side1,
      this.side2,
      this.side3
    );
    const splitPoint = lerpPoints(pointA, pointB, dividePoint);

    const child1 = new Triangle(splitPoint, opposite, pointA, this.depth + 1);
    const child2 = new Triangle(splitPoint, opposite, pointB, this.depth + 1);

    return [child1, child2];
  }
}

function generateTriangles() {
  triangles = [];

  const triangle1 = new Triangle(
    [0 + m, 0 + m],
    [width - m, 0 + m],
    [0 + m, height - m]
  );
  const triangle2 = new Triangle(
    [width - m, height - m],
    [0 + m, height - m],
    [width - m, 0 + m]
  );

  grow(triangle1, 0);
  grow(triangle2, 0);
}

function grow(triangle, depth) {
  if (depth >= depthLimit) {
    triangles.push(triangle);
    return;
  }
  const [child1, child2] = triangle.subdivide();
  grow(child1, depth + 1);
  grow(child2, depth + 1);
}

function distanceSquared(pointA, pointB) {
  const deltaX = pointA[0] - pointB[0];
  const deltaY = pointA[1] - pointB[1];
  return deltaX * deltaX + deltaY * deltaY;
}

// find the longest side to split the triangle
function longestSideWithOpposite(side1, side2, side3) {
  const d12 = distanceSquared(side1, side2);
  const d23 = distanceSquared(side2, side3);
  const d31 = distanceSquared(side3, side1);

  if (d12 >= d23 && d12 >= d31) {
    return { pointA: side1, pointB: side2, opposite: side3 };
  } else if (d23 >= d12 && d23 >= d31) {
    return { pointA: side2, pointB: side3, opposite: side1 };
  } else {
    return { pointA: side3, pointB: side1, opposite: side2 };
  }
}

function lerpPoints(pointA, pointB, interpolation) {
  return [
    pointA[0] + (pointB[0] - pointA[0]) * interpolation,
    pointA[1] + (pointB[1] - pointA[1]) * interpolation,
  ];
}

// audio and ui setup, based on tonejs github example
async function setupAudioContext() {
  try {
    // load midis
    audioAnalyser = new Tone.Analyser("waveform", 256);

    await loadMidiFile(midiFiles[currentMidiIndex]);
  } catch (error) {
    console.error("Error setting up audio:", error);
  }
}

async function loadMidiFile(filename) {
  try {
    // get song data
    const response = await fetch(`assets/MIDI/${filename}`);
    const midiData = await response.json();
    midi = midiData;

    if (midi.header.tempos && midi.header.tempos.length > 0) {
      currentTempo = midi.header.tempos[0].bpm || 120;
    }

    console.log(`Loaded ${filename}, tempo: ${currentTempo}`);

    radiusTarget = map(currentTempo, 60, 180, 80, 200);
    noStroke();
  } catch (error) {
    console.error("Error loading MIDI file:", error);
  }
}

function updateAudioAnalysis() {
  if (!audioAnalyser) return;

  // update less often to save power
  if (frameCount % 3 !== 0) return;

  // get audio data
  const waveform = audioAnalyser.getValue();

  // check how loud the music is
  let sum = 0;
  const sampleStep = Math.max(1, Math.floor(waveform.length / 64));
  for (let i = 0; i < waveform.length; i += sampleStep) {
    sum += waveform[i] * waveform[i];
  }
  const rms = Math.sqrt(sum / (waveform.length / sampleStep));

  // smooth out the loudness
  currentIntensity = lerp(currentIntensity, rms * 5, 0.15);

  const tempoFactor = map(currentTempo, 60, 180, 0.5, 2);
  radiusTarget = 70 + currentIntensity * 150 * tempoFactor;
}

async function playMusic() {
  if (!midi || isPlaying) return;

  try {
    // browsers need a click to play sound
    if (Tone.context.state !== "running") {
      await Tone.start();
      console.log("Audio context started");
    }

    // remove old instruments
    synths.forEach((synth) => synth.dispose());
    synths = [];

    const now = Tone.now() + 0.1;

    // make an instrument for each track
    midi.tracks.forEach((track) => {
      if (track.notes && track.notes.length > 0) {
        const synth = new Tone.PolySynth(Tone.Synth, {
          envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 1,
          },
          volume: -6,
        });

        synth.connect(audioAnalyser);
        synth.toDestination();

        synths.push(synth);

        // schedule the notes
        track.notes.forEach((note) => {
          const duration = Math.max(0.01, note.duration || 0);
          try {
            const noteNumber = Tone.Frequency(note.name).toMidi(); //based on tone js github example
            if (noteNumber >= 50) {
              setTimeout(() => {
                const now = performance.now();
                if (now - lastHighPitchTime > 40) {
                  // update less often
                  lastHighPitchTime = now;

                  const centerTriangles = triangles.filter((triangle) =>
                    triangle.intersectsRadius()
                  );
                  if (centerTriangles.length > 0) {
                    const triangle =
                      centerTriangles[
                        Math.floor(Math.random() * centerTriangles.length)
                      ];
                    // Set expiration time (3-5 seconds from now)
                    const expireTime =
                      performance.now() + (300 + Math.random() * 300);
                    highlightedTriangles.set(triangle, expireTime);
                  }
                }
              }, note.time * 1010); //apperently i have to convert to milliseconds then delay for perception
            }

            synth.triggerAttackRelease(
              note.name,
              duration,
              note.time + now,
              note.velocity
            );
          } catch (error) {
            console.warn(
              `Skipped invalid note: ${note.name} (duration: ${duration})`
            );
          }
        });
      }
    });

    isPlaying = true;
    console.log("Music started");
  } catch (error) {
    console.error("Error playing music:", error);
  }
}

function stopMusic() {
  if (!isPlaying) return;

  // remove instrument configurations
  synths.forEach((synth) => synth.dispose());
  synths = [];
  isPlaying = false;
  currentIntensity = 0;
  console.log("Music stopped");
  depthLimit = 0; // no triangles visible
  lastDepthLimit = 0; // no triangles visible
  triangles = []; // no triangles visible
}

async function nextSong() {
  stopMusic();
  currentMidiIndex = (currentMidiIndex + 1) % midiFiles.length;
  await loadMidiFile(midiFiles[currentMidiIndex]);
  updateSongDisplay();
}

async function prevSong() {
  stopMusic();
  currentMidiIndex =
    (currentMidiIndex - 1 + midiFiles.length) % midiFiles.length;
  await loadMidiFile(midiFiles[currentMidiIndex]);
  updateSongDisplay();
}

//Had ai construct and inject ui instead of looking for keypresses, was able to keep prev next song functions and just modify them
function createUIControls() {
  const uiContainer = createDiv("");
  uiContainer.position(20, 20);
  uiContainer.style("color", "white");
  uiContainer.style("font-family", "Arial, sans-serif");
  uiContainer.style("background", "rgba(0,0,0,0.7)");
  uiContainer.style("padding", "15px");
  uiContainer.style("border-radius", "10px");
  uiContainer.style("z-index", "1000");

  const songDisplay = createP("");
  songDisplay.id("songDisplay");
  songDisplay.parent(uiContainer);
  songDisplay.style("margin", "0 0 10px 0");

  const buttonContainer = createDiv("");
  buttonContainer.parent(uiContainer);
  buttonContainer.style("display", "flex");
  buttonContainer.style("gap", "10px");

  const prevBtn = createButton("⏮ Prev");
  prevBtn.parent(buttonContainer);
  prevBtn.mousePressed(prevSong);
  styleButton(prevBtn);

  const playBtn = createButton("▶ Play");
  playBtn.parent(buttonContainer);
  playBtn.mousePressed(() => {
    if (isPlaying) {
      stopMusic();
      playBtn.html("▶");
    } else {
      playMusic();
      playBtn.html("⏸");
    }
  });
  styleButton(playBtn);

  const nextBtn = createButton("Next ⏭");
  nextBtn.parent(buttonContainer);
  nextBtn.mousePressed(nextSong);
  styleButton(nextBtn);

  updateSongDisplay();
  background(0, 0, 0, 100);
}

function styleButton(button) {
  button.style("background", "#333");
  button.style("color", "white");
  button.style("border", "none");
  button.style("padding", "8px 12px");
  button.style("border-radius", "5px");
  button.style("cursor", "pointer");
}

function updateSongDisplay() {
  const songName = midiFiles[currentMidiIndex].replace(".json", "");
  select("#songDisplay").html(
    `Now: <strong>${songName}</strong><br>Tempo: ${Math.floor(
      currentTempo
    )} BPM`
  );
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
  clear();
  setup();
  draw();
}
