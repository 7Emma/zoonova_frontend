import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "../pages/Home";
import CheckoutPage from "../pages/Commande";
import PrivacyPolicyPage from "../pages/Politiques";
import ContactPage from "../pages/Contact";
import CartPage from "../pages/Panier";
import LegalMentionsPage from "../pages/MentionsLegales";
import NacrealePage from "../pages/Editions";
import BookDetailPage from "../pages/Details";
import SuccessPage from "../pages/Success";
import CancelPage from "../pages/Cancel";
import Error404 from "../pages/errors/NotFound";

// Composant pour gérer le scroll automatique
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRoute() {
  return (
    <div className="">
      <ScrollToTop />
      <Routes>
        {/**Routes des pages principales */}
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/book/:bookSlug" element={<BookDetailPage />} />
        <Route path="politiques" element={<PrivacyPolicyPage />} />
        <Route path="/mentions" element={<LegalMentionsPage />} />
        <Route path="/order" element={<CheckoutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/nacreale" element={<NacrealePage />} />

        {/**Message de succes ou echec de paiement */}
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />

        {/**Erreur 404 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
}

export default AppRoute;
