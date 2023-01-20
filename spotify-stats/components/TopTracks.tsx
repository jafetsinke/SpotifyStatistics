import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const offset = 0;

  useEffect(() => {
    setLoading(true);
    fetch('api/spotify/me/top/tracks?time_range=short_term&offset=' + offset)
      .then((res) => res.json())
      .then((data) => {
        setTracks(data.items);
        setLoading(false);
      });
  }, []);

  if (isLoading || !tracks) {
    return (<p>Loading tracks...</p>)
  }

  return (
    <>
      <h1>Top Tracks</h1>
      {tracks.map((track: any, index) => (
        track.rank = index + offset + 1,
        <Track track={track} key={track.id}/>
      ))}
    </>
  )
};

const Track = ({ track }: any) => {
  return (
    <div className="card">
      <Image src={track.album.images[0].url} alt={track.name + " Spotify album cover"} width="256" height="256"></Image>
      <h2>{track.rank}. {track.name}</h2>
      <p><strong>{artists(track.artists)}</strong></p>
      <p><strong>Popularity: </strong>{track.popularity}</p>
      <progress value={track.popularity} max="100"></progress>
      <p><strong>Release date: </strong> {track.album.release_date}</p>
      <audio controls src={track.preview_url}>Your browser does not support the audio element.</audio>
      <p><strong>Total duration: </strong>{trackDurationToReadableString(track.duration_ms)}</p>
      <Link href={track.external_urls.spotify} target="_blank">View track on Spotify</Link><br/>
      {album()}
    </div>
  )

  function artists(artists: Array<any>) {
    if (artists.length === 1) {
      return (
        <Link href={artists[0].external_urls.spotify} target="_blank">{artists[0].name}</Link>
      )
    } else {
      return artists.map((artist: any) => (
        <Link href={artist.external_urls.spotify} target="_blank">{artist.name}, </Link>
      ))
    }
    
  }

  function album() {
    if (track.album.album_type === "ALBUM") {
      return (
        <>
          <p><strong>Album: </strong>{track.album.name}</p>
          <Link href={track.album.external_urls.spotify} target="_blank">View album on Spotify</Link>
        </>
      )
    } else {
      return (
        <>
          <p><strong>Single</strong></p>
        </>
      )
    }
  }
};

const trackDurationToReadableString = (duration: number) => {
  duration = duration / 1000;
  const minutes = Math.floor(duration / 60);
  const seconds = Math.round(duration - minutes * 60);
  return minutes + ":" + seconds.toString().padStart(2, "0");
};

export default TopTracks;