import { useState, useEffect } from "react";

const TopArtists = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('api/spotify/top/tracks')
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
      {artists.map((artist: any) => (
        <Artist artist={artist} key={artist.id} />
      ))}
    </>
  )
};

const Artist = ({ artist }: any) => {
  console.log(artist)
  return (
    <h2>{artist.name}</h2>
  )
};


export default TopArtists;