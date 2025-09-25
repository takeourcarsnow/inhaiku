"use client";

import React, { Dispatch, SetStateAction } from 'react';

type Props = {
  newHaiku: () => void;
  setTheme: Dispatch<SetStateAction<'dark' | 'light'>>;
  openFavorites: () => void;
  openHistory: () => void;
  copyCurrent: () => void;
  shareTwitter: () => void;
  shareFacebook: () => void;
  favActive: boolean;
  toggleFavoriteCurrent: () => void;
};

export default function Buttons({ newHaiku, setTheme, openFavorites, openHistory, copyCurrent, shareTwitter, shareFacebook, favActive, toggleFavoriteCurrent }: Props) {
  return (
    <div className="button-container">
      <button data-action="new-haiku" className="main-button" onClick={() => newHaiku()}>🌺 Generate</button>

      <div className="social-buttons">
  <button data-action="toggle-theme" className="social-button theme" onClick={() => setTheme((t) => t === 'dark' ? 'light' : 'dark')}>🌓 Theme</button>
        <button data-action="toggle-favorites" className="social-button" onClick={openFavorites}>⭐ Favorites</button>
        <button data-action="show-history" className="social-button" onClick={openHistory}>📚 History</button>
        <button data-action="copy" className="social-button" onClick={copyCurrent}>📋 Copy</button>
      </div>

      <div className="bottom-buttons">
        <div className="share-buttons">
          <button data-action="share-twitter" className="social-button twitter" onClick={shareTwitter}>🐦 Share</button>
          <button data-action="share-facebook" className="social-button facebook" onClick={shareFacebook}>📘 Share</button>
        </div>

        <button data-action="favorite-current" className={`social-button favorite-button ${favActive ? 'active' : ''}`} onClick={toggleFavoriteCurrent}>{favActive ? '💛 Favorited' : '🫀 Favorite'}</button>

        <a href="https://nefas.tv" target="_blank" rel="noopener noreferrer" className="social-button patreon">Author</a>
      </div>
    </div>
  );
}
