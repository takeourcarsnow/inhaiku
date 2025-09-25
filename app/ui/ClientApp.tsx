"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import Controls from './components/Controls';
import Modals from './components/Modals';
import StatusBar from './components/StatusBar';
import Display from './components/Display';
import Buttons from './components/Buttons';
import Notification from './components/Notification';
import Content from './components/Content';
import { useAppState } from './hooks/useAppState';

export default function ClientApp() {
  const {
    theme,
    setTheme,
    sound,
    setSound,
    country,
    setCountry,
    category,
    setCategory,
    haikuLang,
    setHaikuLang,
    headlines,
    setHeadlines,
    current,
    currentHaiku,
    history,
    setHistory,
    favorites,
    setFavorites,
    clock,
    dateStr,
    headlineOut,
    haikuOut,
    skeleton,
    notif,
    indicator,
    favActive,
    historyOpen,
    favoritesOpen,
    newHaiku,
    openHistory,
    openFavorites,
    closeModals,
    copyCurrent,
    shareTwitter,
    shareFacebook,
    toggleFavoriteCurrent,
    toast,
    typing,
    ensureHeadlines,
    setLastFetchedAt,
    copyText,
  } = useAppState();

  return (
    <div className="phone-container">
      <div className="screen">
        <StatusBar clock={clock} dateStr={dateStr} />

        <Content
          indicator={indicator}
          country={country}
          setCountry={setCountry}
          haikuLang={haikuLang}
          setHaikuLang={setHaikuLang}
          category={category}
          setCategory={setCategory}
          ensureHeadlines={ensureHeadlines}
          toast={toast}
          typing={typing}
          setHeadlines={setHeadlines}
          setLastFetchedAt={setLastFetchedAt}
          headlineOut={headlineOut}
          haikuOut={haikuOut}
          skeleton={skeleton}
          currentUrl={current?.url}
        />

        <Buttons
          newHaiku={newHaiku}
          setTheme={setTheme}
          openFavorites={openFavorites}
          openHistory={openHistory}
    copyCurrent={copyCurrent}
          shareTwitter={shareTwitter}
          shareFacebook={shareFacebook}
          favActive={favActive}
          toggleFavoriteCurrent={toggleFavoriteCurrent}
        />
      </div>

      <Modals
        historyOpen={historyOpen}
        favoritesOpen={favoritesOpen}
        closeModals={closeModals}
        history={history}
        favorites={favorites}
        copyText={copyText}
        setFavorites={setFavorites}
        toast={toast}
      />

      <Notification notif={notif} />
    </div>
  );
}
