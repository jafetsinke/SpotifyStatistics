import { useSession } from 'next-auth/react'
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';

export default function Recommendations() {
  const { data: session } = useSession();

  const [recommendations, setRecommendations] = useState<any>(null);
  const [boldness, setBoldness] = useState<number>(50);
  const [throttledBoldness, setThrottledBoldness] = useState<number>(50);
  const boldnessLastChanged = useRef<number>(Date.now());
  const [boldnessChangeCooldown, setBoldnessChangeCooldown] = useState<boolean>(false);
  const boldnessQueue = useRef<number[]>([]);

  useEffect(() => {
    fetch('/api/spotify/recommendations?boldness=' + throttledBoldness)
      .then((res) => res.json())
      .then((recommendations) => {
        console.log(recommendations)
        setRecommendations(recommendations);
    });
    console.log("fetching recommendations with boldness: " + throttledBoldness);
  }, [throttledBoldness]);

  function handleSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value);
    setBoldness(value);
    throttledBoldnessUpdate(value);
  }

  function throttledBoldnessUpdate(value: number) {
    const interval = 2000;
    const now = Date.now();
    
    if (now > boldnessLastChanged.current + interval) {
      // last update was more than interval ago, so update now
      setThrottledBoldness(value);
      boldnessLastChanged.current = now;
      console.log("updating boldness immediately", value)
    } else {
      boldnessQueue.current.push(value);
      setBoldnessChangeCooldown(true);

      if (!boldnessChangeCooldown) {
        setTimeout(() => {
          console.log("cooldown finished");
          setBoldnessChangeCooldown(false);
          throttledBoldnessDelayedUpdate();
        }, interval)
      }
    }
  }

  function throttledBoldnessDelayedUpdate() {
    console.log("updating boldness delayed", boldnessQueue.current);
    const value = boldnessQueue.current[boldnessQueue.current.length - 1];
    setThrottledBoldness(value);
  }

  const boldnessStrings = ["Stay in your comfort zone", "Try something new", "Be bold!"];

  function getBoldnessString(min: number, max: number, value: number) {
    const range = max - min;
    const index = Math.floor((value - min) / range * boldnessStrings.length);
    return boldnessStrings[index] || boldnessStrings[boldnessStrings.length - 1];
  }

  if (!session) {
    return (<h2>Not signed in. pls sign in :)</h2>)
  }

  if (recommendations?.error) {
    return (<h2>Error: {recommendations.error}</h2>)
  }

  if (!recommendations) {
    return (<h1>Loading...</h1>)
  }

  return (
    <>
      <h1>Recommendations</h1>
      <p>Based on your top tracks of the past month</p>
      <p><strong>Recommendation Boldness slider</strong></p>
      <input type="range" min="0" max="100" value={boldness} onChange={handleSliderChange}></input>
      <p>Value: {boldness} - {getBoldnessString(0, 100, boldness)}</p>
      <p><i>Preview quality is limited, full quality streaming available on Spotify</i></p>
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Track</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Popularity</th>
              <th>Preview</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recommendations && recommendations.tracks.map((track: any) => (
              <tr key={track.id}>
                <td><Link href={track.external_urls.spotify} target="_blank">{track.name}</Link></td>
                <td>{track.artists.map((artist: any) => artist.name).join(', ')}</td>
                <td>{track.album.name}</td>
                <td>{track.popularity}</td>
                <td>{trackPreview(track)}</td>
                <td><LikeButton id={track.id}></LikeButton></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function LikeButton(props: any) {
  const id = props.id;

  const [liked, setLiked] = useState<boolean>(false);

  function handleClick() {
    if (!liked) {
      fetch('/api/spotify/me/save-songs?ids=' + id)
      .then((response) => {
        setLiked(response.status === 200);
      });
    } else {
      fetch('/api/spotify/me/remove-songs?ids=' + id)
      .then((response) => {
        setLiked(response.status === 200);
      });
    }
  }

  return (
    <button onClick={handleClick}>
      {liked ? "Remove" : "Like song"}
    </button>
  )
}

function trackPreview(track: any) {
  if (!track.preview_url) {
    return "No preview available";
  } else {
    return (
      <audio controls src={track.preview_url}>Your browser does not support the audio element.</audio>
    )
  }
}