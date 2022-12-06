const fix = {
  float(value, decimals) {
    return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
  },

  variable(variable, value) {
    jQuery(":root").css(`--${variable}`, value);
  },

  percentage(value, total) {
    return fix.float((value / total) * 100, 3);
  },

  calc(that, ev, variable) {
    const $this = jQuery(that);
    const value = ev.offsetX;
    const max = $this.width();
    const perc = fix.percentage(value, max);
    fix.variable(variable, `${perc}%`);

    return {
      $this,
      perc
    };
  },

  increase(value = 0, max = 2, step = 1) {
    return value + step >= max ? 0 : value + step;
  },

  pad(number) {
    let num = parseInt(number);
    return num >= 0 && num <= 9 ? `0${num}` : num;
  },

  moment(time) {
    let $time = moment.duration(parseInt(time), "seconds");
    let hour = $time.hours();
    let min = $time.minutes();
    let sec = $time.seconds();
    let _hour = hour > 0 ? `${fix.pad(hour)} : ` : ``;
    let _min_sec = `${fix.pad(min)} : ${fix.pad(sec)}`;
    return `${_hour}${_min_sec}`;
  },

  url(url) {
    return encodeURI(url);
  }
};

class Track {
  static SRC_PREFIX = `https://raw.githubusercontent.com/miko-github/miko-github/gh_assets/assets/sounds`;
  title = "Unknown";
  artist = "unknown";
  cover = `https://www.iphonefaq.org/files/styles/large/public/apple_music.jpg?itok=nqYGxWgh`;

  constructor(data) {
    this.setId(data.id);
    this.setTitle(data.title);
    this.setSrc(data.src);
    this.setArtist(data.artist);
    this.setCover(data.cover);
  }

  setId(id) {
    this.id = id;
    return this;
  }

  setSrc(src) {
    this.src = fix.url(`${Track.SRC_PREFIX}/${src}`);
    return this;
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  setArtist(artist) {
    this.artist = artist;
    return this;
  }

  setCover(cover) {
    this.cover = cover;
    return this;
  }

  getId() {
    return this.id;
  }

  getSrc() {
    return this.src;
  }

  getTitle() {
    return this.title;
  }

  getArtist(doFormat = false) {
    return doFormat ? Track.fixArtist(this.artist) : this.artist;
  }

  getCover() {
    return this.cover;
  }

  static fixArtist(artist) {
    if (isType(artist, "array")) return artist.join(" & ");
    return artist;
  }

  static tags(url) {
    return new Promise(function(resolve, reject) {
      const reader = new FileReader();

      reader.onload = function() {
        const buffer = this.result;
        const tags = new MP3Tag(buffer);

        tags.read();

        return resolve(tags.tags);
      };

      reader.readAsArrayBuffer(url);
    });
  }

  static cover({
    data,
    format
  }) {
    let base64String = "";

    for (let item of data) {
      base64String += String.fromCharCode(item);
    }

    return `data:${data.format};base64,${window.btoa(base64String)}`;
  }
}

class Playlist {
  constructor() {
    this.tracks = [];
  }

  add(data) {
    this.push(new Track(data));
    return this;
  }

  addMany(tracks) {
    tracks.map((track) => this.add(track));
    return this;
  }

  push(data) {
    this.tracks.push(data);
    return this;
  }

  get(trackId) {
    let trackIndex = thhis.tracks.indexOf(trackId);
    let trackItem = this.tracks[trackIndex > -1 ? trackIndex : 0];
    return trackItem;
  }

  getByArtist(artistName) {
    let trackItems = this.tracks.filter((track) => {
      if (isType(track.artist, "array")) {
        return track.artist.includes(artistName);
      }

      return track.artist == artistName;
    });

    return trackItems;
  }

  getByIndex(trackIndex) {
    return this.tracks[trackIndex];
  }

  getAll() {
    return this.tracks;
  }

  remove(trackId) {
    this.tracks = this.tracks.filter((track) => track.id != trackId);
  }

  render(render, $wrapper) {
    this.$this = render;
    this.$wrapper = $wrapper;

    this.$this.render($wrapper);
  }
}

class PlaylistRender {
  constructor(tracks) {
    this.tracks = tracks;
    this.$ = jQuery;
  }

  $Track(props) {
    const $li = this.$("<li></li>");
    const $img = this.$("<img />");
    const $div = this.$("<div></div>");
    const $strong = this.$("<strong></strong>");
    const $span = this.$("<span></span>");

    $li
      .addClass("playlist__track")
      .attr({
        id: `playlist-track-${props.id}`
      })
      .data({
        src: props.src
      })
      .data({
        id: props.id
      });

    $img
      .addClass("playlist__cover")
      .attr({
        src: props.cover
      })
      .attr({
        alt: `cover of ${props.title} from ${Track.fixArtist(props.artist)}`
      });

    $div.addClass("playlist__meta");

    $strong.addClass("playlist__title").text(props.title);

    $span.addClass("playlist__artist").text(Track.fixArtist(props.artist));

    $div.append($strong).append($span);

    $li.append($img).append($div);

    $li.on("click", this.handleClickPlaylistTrack.bind(this, $li));

    return $li.clone(true, true);
  }

  handleClickPlaylistTrack($this) {
    let trackId = $this.data("id");
    return trackId;
  }

  highlight() {}

  create(tracks) {}

  render($wrapper) {
    this.$tracks = this.tracks.map((track) => this.$Track(track));
    $wrapper.append(this.$tracks);
  }
}

class LinkedNode {
  point = {
    next: null,
    prev: null
  };

  constructor(value, index = null) {
    this.setValue(value);
    this.setIndex(index);
  }

  setIndex(index) {
    if (index != null) {
      this.index = index;
    }
    return this;
  }

  getIndex() {
    return this.index;
  }

  setValue(value) {
    this.value = value;
    return this;
  }

  getValue() {
    return this.value;
  }

  setNextPoint(nextPoint) {
    this.point.next = nextPoint;
    return this;
  }

  getNextPoint() {
    return this.point.next;
  }

  hasNextPoint() {
    return this.point.next != null;
  }

  setPrevPoint(prevPoint) {
    this.point.prev = prevPoint;
    return this;
  }

  getPrevPoint() {
    return this.point.prev;
  }

  hasPrevPoint() {
    return this.point.prev != null;
  }
}

class LinkedList {
  list = [];
  currentNode = null;
  head = null;
  tail = null;
  index = 0;

  constructor() {}

  add(value) {
    const index = this.autoincrement();
    const node = new LinkedNode(value, index);

    if (this.length() === 0) {
      this.setHead(node);
      this.setTail(node);
      this.setCurrentNode(node);
      this.push(node);
      return this;
    }

    if (this.length() === 1) {
      let head = this.getHead();
      this.setTail(node);
      head.setNextPoint(node.getIndex());
      node.setPrevPoint(head.getIndex());
      this.push(node);
      return this;
    }

    if (this.length() > 1) {
      let tail = this.getTail();
      tail.setNextPoint(node.getIndex());
      node.setPrevPoint(tail.getIndex());
      this.setTail(node);
      this.push(node);
    }

    return this;
  }

  autoincrement() {
    this.index = this.index + 1;
    return this.index;
  }

  getCurrentNode() {
    return this.currentNode;
  }

  setCurrentNode(node) {
    this.currentNode = node;
    return this;
  }

  setTail(node) {
    this.tail = node;
    return this;
  }

  getTail() {
    return this.tail;
  }

  setHead(node) {
    this.head = node;
    return this;
  }

  getHead() {
    return this.head;
  }

  getNextNode(fromNode = null) {
    if (fromNode === null) {
      let nextNode = this.getNode(this.getCurrentNode().getNextPoint());
      this.setCurrentNode(nextNode);
      return nextNode;
    }

    let nextNode = this.getNode(fromNode.getNextPoint());
    this.setCurrentNode(nextNode);
    return nextNode;
  }

  getPrevNode(fromNode = null) {
    if (fromNode === null) {
      let prevNode = this.getNode(this.getCurrentNode().getPrevPoint());
      this.setCurrentNode(prevNode);
      return prevNode;
    }

    let prevNode = this.getNode(fromNode.getPrevPoint());
    this.setCurrentNode(prevNode);
    return prevNode;
  }

  canGetNextNode() {
    return this.getCurrentNode().hasNextPoint();
  }

  canGetPrevNode() {
    return this.getCurrentNode().hasPrevPoint();
  }

  length() {
    return this.list.length;
  }

  getByIndex(index) {
    return this.list[index];
  }

  getNode(nodeIndex) {
    return this.list.find((node) => node.getIndex() == nodeIndex);
  }

  push(node) {
    this.list.push(node);
    return this;
  }
}

class Player {
  static REPEAT_ALL = 2;
  static REPEAT_ONE = 1;
  static REPEAT_OFF = 0;
  static TIME_TO_BACKWARD = 5;
  static MINIMUM_VOLUME = 0.0;
  static MAXIMUM_VOLUME = 1.0;
  static DEFAULT_VOLUME = 0.5;
  DEFAULT_PLAYLIST_NAME = "primary";
  DEFAULT_CONFIG = {
    shuffle: false,
    repeat: Player.REPEAT_ALL,
    volume: Player.DEFAULT_VOLUME,
    isMute: false,
    tracksLength: 13
  };

  playlists = [];
  currentPlaylist = null;
  currentTrack = null;

  state = {
    isPlaying: false,
    isShufflePlay: false
  };
  config = {};

  constructor(config) {
    this.config = config || this.DEFAULT_CONFIG;
    this.queue = new LinkedList();
  }

  addPlaylist(playlistName, playlistInstance) {
    this.playlists.push({
      name: playlistName,
      instance: playlistInstance
    });
    return this;
  }

  removePlaylist(playlistName) {
    this.playlists = this.playlists.filter(
      (playlist) => playlist.name != playlistName
    );
    return this;
  }

  getPlaylist(playlistName) {
    return this.playlists.find((playlist) => playlist.name === playlistName);
  }

  getCurrentPlaylist() {
    return this.currentPlaylist;
  }

  setPlaylist(playlistName) {
    let playlist = this.playlists.find(
      (playlist) => playlist.name === playlistName
    );

    this.currentPlaylist = playlist;
    return this;
  }

  addPlayer($player) {
    this.$player = $player;
    this.setVolume(this.getVolume());
    this.trigger();
    return this;
  }

  addPlaylistQueue(playlistName) {
    let playlist = playlistName ?
      this.getPlaylist(playlistName) :
      this.getCurrentPlaylist();
    playlist.instance.getAll().map((track) => this.addTrackQueue(track));
    return this;
  }

  addTrackQueue(track) {
    this.queue.add(track);
    return this;
  }

  mount() {
    const currentTrack = this.getCurrentTrack();
    this.setTrack(currentTrack);
    return this;
  }

  setTrack(track) {
    this.setSrc(track);
    this.currentTrack = track;
    return this;
  }

  getCurrentTrack() {
    return this.queue.getCurrentNode().getValue();
  }

  setSrc(track) {
    let trackSource = track.getSrc();
    this.$player.prop("src", trackSource);
    this.$player.attr("src", trackSource);
    return this;
  }

  trigger() {
    const $this = this.$player;

    $this.on("playing", this.handlePlayingAudio.bind(this));
    $this.on("play", this.handlePlayAudio.bind(this));
    $this.on("pause", this.handlePauseAudio.bind(this));
    $this.on("ended", this.handleEndedAudio.bind(this));
  }

  onPlay(handlePlayAudio) {
    this.$player.on("play", handlePlayAudio);
    this.$player.on("playing", handlePlayAudio);
    return this;
  }

  onPause(handlePauseAudio) {
    this.$player.on("pause", handlePauseAudio);
    this.$player.on("ended", handlePauseAudio);
    return this;
  }

  onVolumeChange(handleVolumeChangeAudio) {
    this.$player.on("volumechange", handleVolumeChangeAudio);
    return this;
  }

  handleEndedAudio() {
    if (this.isRepeatAll()) {
      return this.forward();
    }

    if (this.isRepeatOne()) {
      return this.play();
    }

    // fixme
    if (this.isRepeatOff()) {
      this.state.isPlaying = false;
      return this.stop();
    }
  }

  handlePlayingAudio() {
    this.state.isPlaying = true;
  }

  handlePauseAudio() {
    this.state.isPlaying = false;
  }

  handlePlayAudio() {
    this.state.isPlaying = true;
  }

  duration(doFormat = false) {
    if (doFormat) {
      return fix.moment(this.$player.prop("duration"));
    }

    return window.parseFloat(this.$player.prop("duration"));
  }

  time(doFormat = false) {
    if (doFormat) {
      return fix.moment(this.$player.prop("currentTime"));
    }

    return window.parseFloat(this.$player.prop("currentTime"));
  }

  setTime(time) {
    this.$player.prop("currentTime", time);
  }

  isPlaying() {
    return this.state.isPlaying;
  }

  play() {
    this.$player.trigger("play");
    return this;
  }

  pause() {
    this.$player.trigger("pause");
    return this;
  }

  stop() {
    this.pause();
    this.setTime(0);
    return this;
  }

  toggleAction() {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }

    return this;
  }

  forward() {
    if (this.isShufflePlay()) {
      return this.playShuffle();
    }

    if (this.queue.canGetNextNode()) {
      this.queue.getNextNode();
      this.mount();
      return this.play();
    }
  }

  backward() {
    if (this.time() >= Player.TIME_TO_BACKWARD) {
      this.mount();
      return this.play();
    }

    if (this.isShufflePlay()) {
      return this.playShuffle();
    }

    if (this.queue.canGetPrevNode()) {
      this.queue.getPrevNode();
      this.mount();
      return this.play();
    }
  }

  isMute() {
    return this.config.isMute;
  }

  mute() {
    this.$player.prop("volume", Player.MINIMUM_VOLUME);
    this.config.isMute = true;
    return this;
  }

  unmute() {
    this.config.isMute = false;
    this.setVolume(this.getVolume());
    return this;
  }

  toggleMute() {
    return this.isMute() ? this.unmute() : this.mute();
  }

  setVolume(offset) {
    let volume = Player.fixVolume(offset);
    this.config.volume = volume;
    this.$player.prop("volume", volume);

    if (volume <= Player.MINIMUM_VOLUME) {
      this.mute();
    }

    return this;
  }

  getVolume() {
    return this.config.volume;
  }

  static fixVolume(volume) {
    return volume > Player.MAXIMUM_VOLUME ? fix.float(volume / 100, 3) : volume;
  }
}

class DetailsRender {
  constructor($this) {
    this.$this = $this;
    this.$cover = $this.$cover;
    this.$title = $this.$title;
    this.$artist = $this.$artist;
  }

  update(data) {
    this.setArtist(data.artist);
    this.setTitle(data.title);
    this.setCover(data.cover);
  }

  setArtist(artist) {
    this.$artist.html(Track.fixArtist(artist));
    return this;
  }

  setTitle(title) {
    this.$title.html(title);
    return this;
  }

  setCover(src) {
    this.$cover.attr({
      src: src
    });
    return this;
  }
}

const playlist = new Playlist("primary");

playlist
  .add({
    id: 0,
    title: `Arayeshe Ghaliz`,
    src: `Homayoun Shajarian - Arayeshe Ghaliz.mp3`,
    artist: `Homayoun Shajarian`,
    cover: `https://www.ganja2music.com/Image/Post/06.93/08/Homayoun-Shajarian---Arayes.jpg`
  })
  .add({
    id: 1,
    title: `Nowruz`,
    src: `Homayoun Shajarian & Sohrab Pournazeri - Norouz.mp3`,
    artist: `Homayoun Shajarian`,
    cover: `https://myritm.com/Uploads/Pictures/1397-07/H/Homayoun-Shajarian-Norooz-Picture.jpg`
  })
  .add({
    id: 2,
    title: `Sholeh Var (Flaming)`,
    src: `Homayoun_shajarian_SholehVar_Final.mp3`,
    artist: `Homayoun Shajarian`,
    cover: `https://www.ganja2music.com/Image/Post/5.2021/Homayoun Shajarian - Flaming (Sholeh Var).jpg`
  })
  .add({
    id: 3,
    title: `Saghi Bia`,
    src: `MohammadReza Shajaryan - Saghi Bia.mp3`,
    artist: `Mohammad Reza Shajarian`,
    cover: `https://mahurmusic.com/wp-content/uploads/ostad_shajarian_saghi_bia.jpg`
  })
  .add({
    id: 4,
    title: `Rap God`,
    src: `Eminem - Rap God.mp3`,
    artist: `Eminem`,
    cover: `https://i1.sndcdn.com/artworks-000060420372-r3rrjq-t500x500.jpg`
  })
  .add({
    id: 5,
    title: `Bande Naaf Ta Khatte Saaf`,
    src: `yas-bande-naaf-ta-khatte-saaf-ft-moer.mp3`,
    artist: [`Yas`, `Moer`],
    cover: `https://www.ganja2music.com/Image/Post/3.2018/Yas - Bande Naaf Ta Khatte Saaf (Ft Moer).jpg`
  })
  .add({
    id: 6,
    title: `Halal Osoun`,
    src: `ali_ardavan & sohrab mj_halal_osoun.mp3`,
    artist: [`Ali Ardavan`, `Sohrab MJ`],
    cover: `http://r3d-dl.online/thumb500/AliArdavanHalalOsoun.jpg`
  })
  .add({
    id: 7,
    title: `Sobhoone`,
    src: `Ho3ein - Sobhoone.mp3`,
    artist: `Ho3ein`,
    cover: `https://i1.sndcdn.com/artworks-P62UUTWyllEk4zqO-5e8VaA-t500x500.jpg`
  })
  .add({
    id: 8,
    title: `Hamid Sefat - Hayhat`,
    src: `Hamid Sefat - Hayhat.mp3`,
    artist: `Hamid Sefat`,
    cover: `https://i1.sndcdn.com/artworks-000219705530-hx9noo-t500x500.jpg`
  })
  .add({
    id: 9,
    title: `Makhlase Kaloom`,
    src: `Shayea - Makhlase Kaloom.mp3`,
    artist: `Shayea`,
    cover: `https://i1.sndcdn.com/artworks-cWW8UKEe1zhiRgBk-WWS5xQ-t500x500.jpg`
  })
  .add({
    id: 10,
    title: `Tukur Tukur`,
    src: `Tukur Tukur - Arijit Singh.mp3`,
    artist: `Pritam Chakraborty`,
    cover: `https://a10.gaanacdn.com/gn_img/albums/w4MKPgOboj/4MKPanrg3o/size_l.webp`
  })
  .add({
    id: 11,
    title: `Tharki Chokro`,
    src: `01 - Tharki Chokro.mp3`,
    artist: `Swaroop Khan`,
    cover: `https://a10.gaanacdn.com/images/albums/99/265399/crop_480x480_265399.jpg`
  })
  .add({
    id: 12,
    title: `BTS - Mic Drop`,
    src: `Bts-Mic-Drop-128.mp3`,
    artist: `BTS`,
    cover: `https://i1.sndcdn.com/artworks-000402783318-vlz0bb-t500x500.jpg`
  })
  .add({
    id: 13,
    title: `Ludovico Einaudi - Experience`,
    src: `Ludovico Einaudi - Experience.mp3`,
    artist: `Ludovico Einaudi`,
    cover: `https://i1.sndcdn.com/artworks-000505758237-m6u0q8-t500x500.jpg`
  });

const player = new Player();
const $ = jQuery;
const $BUTTON_ENABLED = "button--active";
const $BUTTON_DISABLED = "button--diactive";
const $ACTION_PLAY_ICON = "fa-play";
const $ACTION_PAUSE_ICON = "fa-pause";
const $VOLUME_MUTE_ICON = "fa-volume-mute";
const $VOLUME_UNMUTE_ICON = "fa-volume";
const $REPEAT_ALL_ICON = "fa-repeat";
const $REPEAT_ONE_ICON = "fa-repeat-1";
const $REPEAT_OFF_ICON = "fa-repeat";
const $CSS_VOLUME = "volume_listener_percentage";
const $CSS_DURATION = "seek_listener_percentage";

jQuery(document).ready(function($) {
  // const $details = new DetailsRender();
  const $player = {
    audio: $("audio"),
    action: $(".button--action"),
    forward: $(".button--forward"),
    backward: $(".button--backward"),
    repeat: $(".button--repeat"),
    shuffle: $(".button--shuffle"),
    playlist: $(".button--playlist"),
    volumeAction: $(".button--volume"),
    volumebar: $(".bar--volume"),
    durationbar: $(".bar--duration"),
    duration: $(".duration__until"),
    time: $(".duration__current")
  };

  player.addPlayer($player.audio);
  player.addPlaylist("primary", playlist);
  player.setPlaylist("primary");
  player.addPlaylistQueue("primary");
  player.mount();

  player.onPlay(handlePlayPlayerAudio.bind($player.action));
  player.onPause(handlePausePlayerAudio.bind($player.action));
  player.onVolumeChange(handleVolumePlayerAudio.bind($player.volumeAction));

  $player.audio.on("durationchange", function(ev) {
    return handleUpdateAudioDuration.call(this, ev, $player.duration);
  });
  $player.audio.on("timeupdate", function(ev) {
    return handleUpdateAudioTime.call(this, ev, $player.time);
  });
  // $player.durationbar.on("mousedown", handleMouseDownDurationbar);
  // $player.durationbar.on("mouseup", handleMouseUpDurationbar);
  $player.durationbar.on("click", handleClickDurationbar);
  $player.action.on("click", handleClickAction);
  $player.forward.on("click", handleClickForward);
  $player.backward.on("click", handleClickBackward);
  $player.repeat.on("click", handleClickRepeatAction);
  $player.shuffle.on("click", handleClickShuffleAction);
  $player.volumeAction.on("click", handleClickVolumeAction);
  $player.volumebar.on("click", handleClickVolumebar);
});

function handleMountPlayerAudio() {
  const $this = $(this);
  $this.setTitle(player.getCurrentTrack().getTitle());
  $this.setArtist(player.getCurrentTrack().getArtist());
  $this.setCover(player.getCurrentTrack().getCover());
}

function handlePlayPlayerAudio() {
  const $this = this;
  const $icon = $this.children(0);

  if ($icon.hasClass($ACTION_PLAY_ICON)) {
    $icon.removeClass($ACTION_PLAY_ICON);
    $icon.addClass($ACTION_PAUSE_ICON);
  }
}

function handlePausePlayerAudio() {
  const $this = this;
  const $icon = $this.children(0);

  if ($icon.hasClass($ACTION_PAUSE_ICON)) {
    $icon.removeClass($ACTION_PAUSE_ICON);
    $icon.addClass($ACTION_PLAY_ICON);
  }
}

function handleVolumePlayerAudio() {
  const $this = this;
  const $icon = $this.children(0);

  if (player.isMute()) {
    return $icon.removeClass($VOLUME_UNMUTE_ICON).addClass($VOLUME_MUTE_ICON);
  }

  return $icon.removeClass($VOLUME_MUTE_ICON).addClass($VOLUME_UNMUTE_ICON);
}

function handleUpdateAudioDuration(ev, $duration) {
  $duration.html(player.duration(true));
}

function handleUpdateAudioTime(ev, $time) {
  const perc = fix.percentage(player.time(), player.duration());
  fix.variable($CSS_DURATION, `${perc}%`);
  $time.html(player.time(true));
}

function handleMouseDownDurationbar() {
  player.pause();
}

function handleMouseUpDurationbar() {
  player.play();
}

function handleClickBackward() {
  return player.backward();
}

function handleClickForward() {
  return player.forward();
}

function handleClickAction() {
  let $this = $(this);
  player.toggleAction();
  $this.attr({
    title: player.isPlaying() ? "play" : "pause"
  });
}

function handleClickRepeatAction() {
  let $this = $(this);
  let $icon = $this.children(0);

  player.switchRepeat();

  if (player.isRepeatOff()) {
    disableButton($this);
    return $icon.removeClass($REPEAT_ONE_ICON).addClass($REPEAT_OFF_ICON);
  } else {
    enableButton($this);
  }

  if (player.isRepeatAll()) {
    return $icon.removeClass($REPEAT_OFF_ICON).addClass($REPEAT_ALL_ICON);
  }

  if (player.isRepeatOne()) {
    return $icon.removeClass($REPEAT_ALL_ICON).addClass($REPEAT_ONE_ICON);
  }
}

function handleClickShuffleAction() {
  const $this = $(this);

  player.toggleShuffle();

  if (player.isShuffleEnable()) {
    return enableButton($this);
  }

  return disableButton($this);
}

function handleClickVolumeAction() {
  let $this = $(this);
  let volume = "0%";

  player.toggleMute();

  if (player.isMute()) {
    return fix.variable($CSS_VOLUME, volume);
  }

  volume = fix.float(player.getVolume() * 100, 3);
  return fix.variable($CSS_VOLUME, `${volume}%`);
}

function handleClickVolumebar(ev) {
  const {
    $this,
    perc
  } = fix.calc(this, ev, $CSS_VOLUME);
  const volume = fix.float(perc / 100, 3);
  player.unmute();
  player.setVolume(volume);
  $this.attr({
    title: `${fix.float(volume * 100, 3)}%`
  });
}

function handleClickDurationbar(ev) {
  const {
    perc
  } = fix.calc(this, ev, $CSS_DURATION);
  // const time = fix.float(perc * player.$player.prop("duration"), 3);
  const time = (perc / 100) * player.duration();
  player.setTime(time);
}

function enableButton($this) {
  $this.hasClass($BUTTON_DISABLED) && $this.removeClass($BUTTON_DISABLED);
  return $this.addClass($BUTTON_ENABLED);
}

function disableButton($this) {
  $this.hasClass($BUTTON_ENABLED) && $this.removeClass($BUTTON_ENABLED);
  return $this.addClass($BUTTON_DISABLED);
}
