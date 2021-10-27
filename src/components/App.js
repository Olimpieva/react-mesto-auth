// import logo from '../logo.svg';
import React, { useState, useEffect } from 'react';
import api from '../utils/Api';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup';
import { CurrentUserContext } from '../context/CurrentUserContext';

function App() {

  const [currentUser, setCurrentUser] = useState({});
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);

  useEffect(() => {
    api.getUserInfo()
      .then(userData => {
        setCurrentUser(userData);
      })
      .catch(error => console.log(`Произошла ошибка: ${error}`));
  }, [])

  useEffect(() => {
    api.getInitialCards()
      .then(initialCards => {
        setCards(initialCards);
      })
      .catch(error => console.log(`Произошла ошибка: ${error}`));
  }, [])

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    }

    document.addEventListener('keydown', closeByEscape);

    return () => document.removeEventListener('keydown', closeByEscape);
  }, [])

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleUpdateAvatar({ avatar }) {
    api.updateAvatar(avatar)
      .then((updatedUserInfo) => {
        setCurrentUser(updatedUserInfo);
        closeAllPopups();
      })
      .catch(error => console.log(`Произошла ошибка: ${error}`));
  }

  function handleUpdateUser(newUserInfo) {
    api.updateUserInfo(newUserInfo)
      .then((updatedUserInfo) => {
        setCurrentUser(updatedUserInfo);
        closeAllPopups();
      })
      .catch(error => console.log(`Произошла ошибка: ${error}`));
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(item => item._id === currentUser._id);

    api.changeLikeCardStatus(card._id, isLiked)
      .then((updatedCard) => {
        setCards((prevCards) => {
          return prevCards.map((prevCard) => prevCard._id === card._id ? updatedCard : prevCard);
        });
      })
      .catch(error => console.log(`Произошла ошибка: ${error}`));
  }
  function handleCardTrashClick(card) {
    setCardToDelete(card)
  }

  function handleAddPlaceSubmit(cardInfo) {
    api.addCard(cardInfo)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(error => console.log(`Произошла ошибка: ${error}`));
  }

  function handleDeleteCard(card) {
    api.removeCard(card._id)
      .then(() => {
        setCards((prevCards) => {
          closeAllPopups();
          return prevCards.filter((prevCard) => prevCard._id !== card._id);
        });
      })
      .catch(error => console.log(`Произошла ошибка: ${error}`));
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setCardToDelete(null);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          cards={cards}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardTrashClick} />
        <Footer />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar} />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser} />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit} />

        <ImagePopup
          card={selectedCard || {}}
          onClose={closeAllPopups} />

        <ConfirmationPopup
          data={cardToDelete}
          onClose={closeAllPopups}
          onSubmit={handleDeleteCard} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;