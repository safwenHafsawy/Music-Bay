const MusicPublicUrl = process.env.PUBLICURL;

const getMusicList = (genre) => {
  const result = [];
  const MUSIC_LIST = {
    Rap: {},
    Jazz: {
      1: {
        name: "Wondeful World",
        owner: "Louis Armstrong",
        link: `${MusicPublicUrl}music/${genre}/jazz1.mp3`,
      },
      2: {
        name: "Sky is Crying",
        owner: "Gary B.B. Coleman",
        link: `${MusicPublicUrl}music/${genre}/jazz2.mp3`,
      },
      3: {
        name: "Fly Me to the moon",
        owner: "Frank Sinatra",
        link: `${MusicPublicUrl}music/${genre}/jazz3.mp3`,
      }, //

      4: { name: "Fever", owner: "Peggy Lee", link: `${MusicPublicUrl}music/${genre}/jazz4.mp3` },
    },
    Lofi: {},
    Rock: {},
    Country: {
      1: {
        name: "Tennessee Whiskey",
        owner: "Chris Stapleton",
        link: `${MusicPublicUrl}music/${genre}/country1.mp3`,
      },
    },
  };

  const keys = Object.keys(MUSIC_LIST[genre]);
  const values = Object.values(MUSIC_LIST[genre]);

  keys.forEach((key, i) => result.push([key, values[i]]));

  return result;
};

export default getMusicList;
