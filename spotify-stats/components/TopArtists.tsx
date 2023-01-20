import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const TopArtists = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const offset = 0;

  useEffect(() => {
    setLoading(true);
    fetch('api/spotify/me/top/artists?time_range=short_term&offset=' + offset)
      .then((res) => res.json())
      .then((data) => {
        setArtists(data.items);
        setLoading(false);
      });
  }, []);

  if (isLoading || !artists) {
    return (<p>Loading artists...</p>)
  }

  return (
    <>
      <h1>Top Artists</h1>
      {artists.map((artist: any, index) => (
        artist.rank = index + offset + 1,
        <Artist artist={artist} key={artist.id}/>
      ))}
    </>
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

export default TopArtists;