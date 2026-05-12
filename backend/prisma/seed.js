import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const missionNames = [
  "Apollo 11", "Challenger", "Discovery", "Endeavour", "Atlantis",
  "Columbia", "Mir", "ISS-Alpha", "Skylab-1", "Salyut-7",
  "Vostok-1", "Mercury-Atlas", "Gemini-7", "Saturn-V", "SpaceX-Starship",
  "Blue Origin-NS", "Virgin Galactic-1", "Soyuz-MS", "Falcon-9", "Falcon-Heavy",
  "Ariane-5", "Delta-IV", "Atlas-V", "Proton-M", "Long-March",
  "H-IIB", "Rocket-Lab", "Relativity-1", "Axiom-1", "Sierra-Space",
  "Luna-Program", "Mars-Rover", "Perseverance", "Curiosity", "Opportunity",
  "Viking-1", "Mars-Express", "Rosetta", "Philae", "Dawn",
  "New-Horizons", "Voyager-1", "Voyager-2", "Pioneer-10", "Pioneer-11",
  "Galileo", "Cassini", "Hubble", "Spitzer", "Kepler",
  "TESS", "Chandra", "XMM-Newton", "Swift", "Fermi",
  "Parker-Solar", "SOHO", "STEREO", "TRACE", "Yohkoh",
  "GOES-East", "GOES-West", "Sentinel-1", "Sentinel-2", "Sentinel-3",
  "Landsat-8", "Landsat-9", "MODIS", "SeaWiFS", "TRMM",
  "CloudSat", "CALIPSO", "Aqua", "Terra", "Aura",
  "OMI", "AIRS", "MLS", "TES", "HIRDLS",
  "Himawari-8", "Himawari-9", "INSAT-3D", "INSAT-3DR", "FY-4A",
  "Meteosat-11", "MSG-4", "NOAA-19", "NOAA-20", "NOAA-21",
  "Suomi-NPP", "JPSS-1", "JPSS-2", "CrIS", "VIIRS",
  "ATMS", "AMSR-2", "SCAT", "HY-2B", "Jason-3",
  "SWOT", "Sentinel-6", "Topex", "Poseidon", "ERS-1",
  "ERS-2", "Envisat", "MERIS", "ASAR", "GFO",
  "Cryosat-2", "SMOS", "Gravity-Mission", "GRACE", "GOCE",
  "Cluster", "Double-Star", "THEMIS", "MMS", "DSCOVR",
  "ACE", "WIND", "SOHO", "SoHO-2", "STEREO-A",
  "STEREO-B", "SDO", "Hinode", "Proba", "PICARD",
  "CoRoT", "Gaia", "Hipparcos", "Tycho", "2MASS",
  "WISE", "Planck", "WMAP", "COBE", "DIRBE"
];

const locations = [
  "Cape Canaveral", "Kennedy Space Center", "Baikonur Cosmodrome",
  "Tanegashima", "Arianespace", "Wenchang", "Vandenberg Space Force",
  "Plesetsk", "Guiana Space Centre", "Jiuquan", "Xichang",
  "Wallops Flight Facility", "Kodiak Launch Complex", "Mojave Spaceport",
  "Spaceport America", "Virgin Orbit", "Relativity Space", "Axiom Space",
  "Sierra Space", "Rocket Lab Launch Complex", "Starbase", "Boca Chica"
];

const rocketTypes = [
  "Falcon-9", "Falcon-Heavy", "Starship", "Delta-IV-Heavy", "Atlas-V",
  "Proton-M", "Soyuz-FG", "Ariane-5", "H-IIB", "Long-March-5",
  "Angara-A5", "Vega-C", "Minotaur-IV", "Pegasus-XL", "Electron",
  "Neutron", "New-Glenn", "Blue-Origin-BE4", "SpaceShipTwo", "DreamChaser"
];

const crewRoles = [
  "Commander", "Pilot", "Flight-Engineer", "Mission-Specialist",
  "Payload-Specialist", "Researcher", "Engineer", "Scientist",
  "Medical-Officer", "Navigation-Officer", "Systems-Officer"
];

const eventTypes = [
  "Launch",
  "Stage-Separation",
  "Orbit-Insertion",
  "Course-Correction",
  "Engine-Ignition",
  "Docking",
  "Undocking",
  "EVA-Start",
  "EVA-End",
  "System-Check",
  "Experiment-Start",
  "Experiment-Complete",
  "Communication-Established",
  "Communication-Lost",
  "Course-Adjust",
  "Deorbit-Burn",
  "Re-entry",
  "Parachute-Deploy",
  "Landing",
  "Mission-Complete",
  "Solar-Panel-Deploy",
  "Antenna-Deployment",
  "Payload-Release",
  "Fuel-Transfer",
  "Emergency-Procedure"
];

async function main() {
  console.log("🌌 Seeding database with 200 space missions...");
  
  await prisma.mission.deleteMany();
  
  for (let i = 0; i < 200; i++) {
    const missionName = missionNames[i % missionNames.length] + `-${Math.floor(i / missionNames.length) + 1}`;
    const launchDate = new Date(2020 + Math.floor(i / 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    
    // Generate a large description (5000+ characters) to simulate payload bloat
    const description = `Mission ${i + 1}: ${missionName}\n\n`.repeat(100) +
      "This is a detailed mission description containing telemetry data, crew information, " +
      "payload specifications, and experimental objectives. ".repeat(50);
    
    const mission = await prisma.mission.create({
      data: {
        name: missionName,
        launchDate,
        status: ["PLANNED", "LAUNCHED", "IN_ORBIT", "COMPLETED", "FAILED"][Math.floor(Math.random() * 5)],
        rocket: rocketTypes[Math.floor(Math.random() * rocketTypes.length)],
        description,
        crew: {
          create: Array.from({ length: Math.floor(Math.random() * 4) + 2 }, (_, j) => ({
            name: `Astronaut-${i}-${j}`,
            role: crewRoles[Math.floor(Math.random() * crewRoles.length)]
          }))
        },
        logs: {
          create: Array.from({ length: Math.floor(Math.random() * 9) + 1 }, (_, j) => ({
            timestamp: new Date(launchDate.getTime() + j * 3600000),
            event: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            details: `Event details for mission ${i + 1}, log entry ${j + 1}`
          }))
        }
      }
    });
    
    if ((i + 1) % 50 === 0) {
      console.log(`✅ Created ${i + 1} missions`);
    }
  }
  
  console.log("✅ Database seeded successfully!");
  const missionCount = await prisma.mission.count();
  console.log(`📊 Total missions: ${missionCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
