import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SpotifyTimeRange, SpotifyTopItemsType } from "@/lib/spotify";


// TODO suggest to use TopTracks and TopArtists and factor out common code in function, instead of branching.
const Top = (props: {type: SpotifyTopItemsType}) => {
  const [timeRange, setTimeRange] = useState<SpotifyTimeRange>("short_term");

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  return (
    <>
      <h1>Top {props.type === "artists" ? "Artists" : "Tracks"}</h1>
      <div>
        <input type="radio" name="Short term" value="short_term" onChange={handleTimeRangeChange} checked={timeRange === "short_term"} /> about 4 weeks
        <input type="radio" name="Medium term" value="medium_term" onChange={handleTimeRangeChange} checked={timeRange === "medium_term"} /> about 6 months 
        <input type="radio" name="Long term" value="long_term" onChange={handleTimeRangeChange} checked={timeRange === "long_term"} /> All time
      </div>
      {Items(timeRange, props.type)}<br/>
    </>
  )
};

const Items = (timeRange: SpotifyTimeRange, type: SpotifyTopItemsType) => {
  const [items, setItems] = useState([]);

  // TODO suggest to wrap response in a typed interface - allows typing down the line, with support for IDE and compiler
  useEffect(() => {
    fetch(`api/spotify/me/top/${type}?time_range=${timeRange}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items);
      });
  }, [timeRange, type]);

  if (!items) {
    return (<strong>Loading...</strong>)
  }

  const loadMore = () => {
    fetch(`api/spotify/me/top/${type}?time_range=${timeRange}&offset=${items.length}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(items.concat(data.items));
      });
  };

  return (
    <>
      <p><strong>Average Popularity: {averagePopularity(items)}</strong></p>
      {items.map((item: any, index) => {
        const rankedItem = {...item, rank: index + 1};
        return type === "tracks" ? <Track track={rankedItem} key={item.id}/> : <Artist artist={rankedItem} key={item.id}/>;
      })}
      <br/>
      {items.length < 50 &&
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
      {album(track)}
    </div>
  )
};

const Artist = ({ artist }: any) => {
  return (
    <div className="card">
      <Image src={artist.images[0].url} alt={artist.name + " Spotify profile picture"} width="256" height="256"></Image>
      <h2>{artist.rank}. {artist.name}</h2>
      <p><strong>Followers: </strong> {numberToReadableString(artist.followers.total)}</p>
      <p><strong>Popularity: </strong> {artist.popularity}</p>
      <progress value={artist.popularity} max="100"></progress>
      <p><strong>Genres: </strong> {genreArrayToString(artist.genres)}</p>
      <Link href={artist.external_urls.spotify} target="_blank">View on Spotify</Link>
    </div>
  )
};

export function artistsLinks(artists: Array<any>) {
  if (artists.length === 1) {
    return (
      <Link href={artists[0].external_urls.spotify} target="_blank">{artists[0].name}</Link>
    )
  } else {
    return artists.map((artist: any) => (
      <Link href={artist.external_urls.spotify} target="_blank" key={artist.id}>{artist.name}, </Link>
    ))
  }
}

function album(track: any) {
  if (track.album.album_type === "ALBUM") {
    return (
      <>
        <Link href={track.album.external_urls.spotify} target="_blank">View album on Spotify</Link>
        <p><strong>Album: </strong>{track.album.name}</p>
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

const genreArrayToString = (genres: string[]) => {
  if (genres.length === 0) {
    return "None specified";
  } else {
    return genres.join(", ");
  }
};

const numberToReadableString = (number: number) => {
  if (number > 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number > 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number;
  }
};

const averagePopularity = (items: any[]) => {
  let total = 0;
  items.forEach((item) => {
    total += item.popularity;
  });
  return Math.round(total / items.length);
}

const trackDurationToReadableString = (millis: number) => {
  const totalSeconds = Math.round(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes + ":" + seconds.toString().padStart(2, "0");
};

export default Top;