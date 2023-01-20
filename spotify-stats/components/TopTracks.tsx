import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SpotifyTimeRange } from "@/lib/spotify";


const TopTracks = () => {
  const [timeRange, setTimeRange] = useState<SpotifyTimeRange>("short_term");

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  return (
    <>
      <h1>Top Tracks</h1>
      <div>
        <input type="radio" name="Short term" value="short_term" onChange={handleTimeRangeChange} checked={timeRange === "short_term"} /> ± 4 weeks
        <input type="radio" name="Medium term" value="medium_term" onChange={handleTimeRangeChange} checked={timeRange === "medium_term"} /> ± 6 months 
        <input type="radio" name="Long term" value="long_term" onChange={handleTimeRangeChange} checked={timeRange === "long_term"} /> All time
      </div>
      {Tracks(timeRange)}<br/>
    </>
  )
};

const Tracks = (timeRange: SpotifyTimeRange) => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`api/spotify/me/top/tracks?time_range=${timeRange}`)
      .then((res) => res.json())
      .then((data) => {
        setTracks(data.items);
        setLoading(false);
      });
  }, [timeRange]);

  if (isLoading || !tracks) {
    return (<strong>Loading tracks...</strong>)
  }

  const loadMore = () => {
    //setLoading(true);
    fetch(`api/spotify/me/top/tracks?time_range=${timeRange}&offset=${tracks.length}`)
      .then((res) => res.json())
      .then((data) => {
        setTracks(tracks.concat(data.items));
        setLoading(false);
      });
  };

  return (
    <>
      {tracks.map((track: any, index) => (
        track.rank = index + 1,
        <Track track={track} key={track.id}/>
      ))}
      <br/>
      {tracks.length < 50 &&
        <button onClick={loadMore}>Load more</button>
      }
    </>
  )
};

const Track = ({ track }: any) => {
  return (
    <div className="card">
      <Image src={track.album.images[0].url} alt={track.name + " Spotify album cover"} width="256" height="256"></Image>
      <h2>{track.rank}. {track.name}</h2>
      <p><strong>{artistsLinks(track.artists)}</strong></p>
      <p><strong>Popularity: </strong>{track.popularity}</p>
      <progress value={track.popularity} max="100"></progress>
      <p><strong>Release date: </strong> {track.album.release_date}</p>
      <audio controls src={track.preview_url}>Your browser does not support the audio element.</audio>
      <p><strong>Total duration: </strong>{trackDurationToReadableString(track.duration_ms)}</p>
      <Link href={track.external_urls.spotify} target="_blank">View track on Spotify</Link><br/>
      {album()}
    </div>
  )

  function artistsLinks(artists: Array<any>) {
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