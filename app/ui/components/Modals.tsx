"use client";

import React from 'react';
import type { HaikuEntry } from '../lib/utils';

type Props = {
  historyOpen: boolean;
  favoritesOpen: boolean;
  closeModals: () => void;
  history: HaikuEntry[];
  favorites: HaikuEntry[];
  copyText: (t: string) => void;
  setFavorites: (f: HaikuEntry[]) => void;
  toast: (s: string) => void;
};

export function Modals({ historyOpen, favoritesOpen, closeModals, history, favorites, copyText, setFavorites, toast }: Props) {
  return (
    <>
      {historyOpen && (
        <div className="modal-container" role="dialog" aria-modal="true" aria-label="Haiku history">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Haiku History</h2>
              <button data-action="close-modal" className="close-button" onClick={closeModals}>✖️</button>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="item-header" style={{justifyContent:'center', opacity:.8}}>History is empty.</div>
              ) : history.map((e, i) => (
                <div key={i} className="history-item">
                  <div className="item-header">
                    <span className="item-source">{e.source} • {e.country} • {e.category} • {e.haikuLang || ''}</span>
                    <span className="item-date">{new Date(e.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="item-headline">{e.title}</div>
                  <div className="item-haiku">{e.haiku}</div>
                  <div className="item-actions">
                    <button className="small-btn" onClick={() => { if (e.url && e.url !== '#') window.open(e.url, '_blank'); }}>Open</button>
                    <button className="small-btn" onClick={() => copyText(`${e.haiku}\n\n${e.title}\n${e.url}`)}>Copy</button>
                    <button className="small-btn" onClick={() => {
                      if (!favorites.some(x => (x.title + x.url + x.haiku).toLowerCase() === (e.title + e.url + e.haiku).toLowerCase())) {
                        setFavorites([e, ...favorites].slice(0, 150));
                        toast('Added to favorites');
                      }
                    }}>Favorite</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {favoritesOpen && (
        <div className="modal-container" role="dialog" aria-modal="true" aria-label="Favorite haiku">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Favorites</h2>
              <button data-action="close-modal" className="close-button" onClick={closeModals}>✖️</button>
            </div>
            <div className="favorites-list">
              {favorites.length === 0 ? (
                <div className="item-header" style={{justifyContent:'center', opacity:.8}}>Nothing here yet.</div>
              ) : favorites.map((e, i) => (
                <div key={i} className="favorite-item">
                  <div className="item-header">
                    <span className="item-source">{e.source} • {e.country} • {e.category} • {e.haikuLang || ''}</span>
                    <span className="item-date">{new Date(e.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="item-headline">{e.title}</div>
                  <div className="item-haiku">{e.haiku}</div>
                  <div className="item-actions">
                    <button className="small-btn" onClick={() => { if (e.url && e.url !== '#') window.open(e.url, '_blank'); }}>Open</button>
                    <button className="small-btn" onClick={() => copyText(`${e.haiku}\n\n${e.title}\n${e.url}`)}>Copy</button>
                    <button className="small-btn" onClick={() => {
                      const key = (e.title + e.url + e.haiku).toLowerCase();
                      const next = favorites.filter(x => (x.title + x.url + x.haiku).toLowerCase() !== key);
                      setFavorites(next);
                      toast('Removed from favorites');
                    }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modals;
