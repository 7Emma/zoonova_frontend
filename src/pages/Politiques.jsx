import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div
      className="min-h-screen py-10 px-6 md:px-12 lg:px-20"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="">
        <div className=" p-8 md:p-12 lg:p-16">
          <h1
            className="text-4xl md:text-5xl font-bowlby text-center mb-12 text-slate-700"
            style={{
              color: "white",
              WebkitTextStroke: "1px #000000",
            }}
          >
            Conditions de ventes NACREALE ÉDITIONS
          </h1>

          <div className="space-y-8 text-slate-700 leading-relaxed">
            {/* Section 1 */}
            <section className="">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                1. Objet
              </h2>
              <p>
                Les présentes conditions générales de vente s'appliquent à toute
                commande passée sur le site Internet{" "}
                <strong className="text-blue-600">www.zoonova.fr</strong>.
                NACREALE ÉDITIONS se réserve le droit de les adapter ou les
                modifier sans préavis. En cas de modification, ce sont ces
                nouvelles conditions générales de vente qui seront appliquées à
                chaque nouvelle commande.
              </p>
            </section>

            {/* Section 2 */}
            <section className="">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                2. Disponibilité des produits
              </h2>
              <div className="space-y-3">
                <p>
                  Nos produits sont valables dans la limite des stocks
                  disponibles. À réception de votre commande, nous vérifions
                  leurs disponibilités. En cas d'indisponibilité, nous nous
                  engageons dans les <strong>30 jours</strong> à compter de la
                  passation de la commande à faire le nécessaire pour vous
                  livrer le produit commandé.
                </p>
                <p>
                  À défaut, nous vous proposerons un produit similaire à un prix
                  similaire, ou nous vous rembourserons. La date de validation
                  de la commande correspond à la date de l'acceptation de votre
                  commande.
                </p>
                <p>
                  En cas de rupture de stock sur l'un des produits de votre
                  commande, nous vous le ferons savoir et expédierons le reste
                  de votre commande, dans le délai maximum, susmentionné de 30
                  jours.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                3. Prix
              </h2>
              <div className="space-y-3">
                <p>
                  Nos prix exprimés en <strong>euros TTC</strong> s'entendent
                  hors frais de transport. Le client qui passe la commande devra
                  s'en acquitter, sauf s'il bénéficie d'une offre spéciale l'en
                  exonérant.
                </p>
                <p>
                  NACREALE ÉDITIONS se réserve le droit de modifier ses prix
                  sans préavis, notamment en cas d'augmentation des charges, du
                  taux de TVA ou en cas d'erreur éditrice. Cependant, ce sont
                  toujours les tarifs qui vous auront été indiqués au moment de
                  votre commande (sous réserve de disponibilité des produits à
                  cette date) qui seront ceux en vigueur.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                4. Paiement et sécurité
              </h2>
              <div className="space-y-3">
                <p>
                  Les utilisateurs peuvent effectuer le règlement de leurs
                  commandes par les moyens suivants :{" "}
                  <strong>
                    Carte Bleue, Carte Visa, Carte American Express et Carte
                    MasterCard
                  </strong>
                  .
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <p className="mb-3">
                    Les données des cartes crédit sont cryptées en{" "}
                    <strong className="text-orange-700">
                      SSL 128 (Secure Socket Layer)
                    </strong>
                    . Elles ne transitent donc jamais en clair sur le réseau et
                    le paiement est directement effectué auprès de la banque.
                  </p>
                  <p>
                    NACREALE ÉDITIONS n'a pas accès à ces données, et ne les
                    garde pas sur ses serveurs. C'est la raison pour laquelle
                    nous vous les redemandons à chaque nouvelle commande.
                  </p>
                </div>
                <p>
                  Les produits demeurent la propriété de NACREALE ÉDITIONS
                  jusqu'à leurs paiements intégraux. Toutefois dès la livraison,
                  les risques des marchandises livrées sont transférés au
                  client.
                </p>
                <p>
                  NACREALE ÉDITIONS se réserve le droit, en cas de défaut de
                  paiement, de refuser d'effectuer une livraison ou d'honorer
                  une commande émanant d'un client utilisateur n'ayant pas réglé
                  totalement ou partiellement une commande précédente ; voir
                  avec lequel un litige de paiement subsiste.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                5. Livraison
              </h2>
              <div className="space-y-3">
                <p>
                  NACREALE ÉDITIONS s'engagent à livrer les commandes sans
                  délai. Elles seront acheminées par les services postaux qui
                  seront tenus à leurs propres délais de livraison. Par
                  conséquent NACREALE ÉDITIONS ne pourra pas être tenues
                  responsables d'éventuels retards de livraison.
                </p>
                <p>
                  Idem lorsque le client/utilisateur commet une erreur dans le
                  libellé de son adresse, entraînant un retard de distribution
                  au niveau des services postaux. Si la commande était retournée
                  à NACREALE ÉDITIONS, le client/utilisateur accepte que les
                  frais de réexpédition lui soient (re)facturés.
                </p>
                <p className="font-semibold">
                  Si d'aventure la commande arrivait défectueuse,
                  l'utilisateur/client dispose d'un délai de{" "}
                  <strong className="text-red-600">48 heures</strong> pour faire
                  sa réclamation auprès NACREALE ÉDITIONS. Il sera ainsi procédé
                  à l'échange du produit concerné.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                6. Responsabilités
              </h2>
              <div className="space-y-3">
                <p>
                  NACREALE ÉDITIONS ne saura pas tenu responsable de la
                  non-exécution du contrat de vente en cas de force majeure ou
                  fortuit (inondations, incendies, tempête, etc.) de grève des
                  services postaux et de perturbation des moyens de transport
                  et/ou de communications.
                </p>
                <p>
                  L'utilisateur client est le seul responsable de sa volonté
                  d'achat sur <strong>www.zoonova.fr</strong>. Il ne pourra
                  faire grief d'un préjudice ouvrant droit à un quelconque
                  dédommagement s'il ne pouvait après son achat en faire l'usage
                  auquel le produit est destiné.
                </p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <p>
                    Lorsqu'un produit commandé est non livré, ou livré avec des
                    produits manquants, l'acheteur doit se manifester dans un
                    délai de{" "}
                    <strong className="text-indigo-700">30 jours</strong> (à
                    compter de la date de la passation de commande).
                  </p>
                  <p className="mt-3 font-semibold text-indigo-900">
                    Au-delà de ce délai NACREALE ÉDITIONS ne pourra accepter
                    aucune réclamation.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                7. Rétractation
              </h2>
              <div className="space-y-3">
                <p>
                  NACREALE ÉDITIONS accorde à l'utilisateur un délai de{" "}
                  <strong className="text-teal-600">14 jours ouvrables</strong>{" "}
                  à compter de la réception des produits commandés pour
                  retourner à ses frais ceux qui ne lui conviendraient pas. Il
                  doit cependant communiquer au préalable cette volonté de
                  retour à l'adresse mail :{" "}
                  <a
                    href="mailto:hello@zoonova.fr"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    hello@zoonova.fr
                  </a>
                </p>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                  <p className="mb-3">
                    Bien évidemment, les produits retournés doivent être{" "}
                    <strong className="text-teal-700">à l'état neuf</strong>. En
                    effet, tout produit détérioré, incomplet ou sali ne sera ni
                    repris ni échangé.
                  </p>
                  <p>
                    Après réception du produit retourné à l'état neuf par vos
                    soins, NACREALE ÉDITIONS s'engage à vous faire un échange
                    dans un délai maximum de <strong>30 jours</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section className="">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                8. Informations légales
              </h2>
              <div className="space-y-3">
                <p>
                  Pour traiter, acheminer et facturer les commandes passées par
                  l'utilisateur / acheteur, il est nécessaire que nous
                  collections les informations nominatives aux fins de rendre
                  possible ce contrat de vente à distance. Par conséquent, le
                  défaut de renseignement entraîne la non-validation de la
                  commande.
                </p>
                <p>
                  Conformément à la loi{" "}
                  <strong>"Informatique et Libertés"</strong>, le traitement des
                  informations nominatives relatives aux clients a fait l'objet
                  d'une déclaration auprès de la Commission Nationale de
                  l'Informatique et des Libertés (CNIL).
                </p>
                <p>
                  De même, le client utilisateur dispose d'un droit d'accès, de
                  modification, de rectification et de suppression des données
                  le concernant, qu'il peut exercer auprès de NACREALE ÉDITIONS
                  (article 34 de la loi du 6 janvier 1978).
                </p>
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                  <p className="font-semibold text-pink-900">
                    NACREALE ÉDITIONS s'engage à ne pas communiquer ou céder les
                    coordonnées de ses clients à un tiers, de manière gratuite
                    ou avec contrepartie.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section className="">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                9. Droits applicables
              </h2>
              <div className="space-y-3">
                <p>
                  Les présentes conditions générales de vente sont régies par la{" "}
                  <strong>loi française</strong>. En cas de difficultés dans
                  l'application du présent contrat NACREALE ÉDITIONS favorisera
                  une démarche amiable avec le client acheteur avant toute
                  action en justice.
                </p>
                <p>
                  À défaut de conciliation, le{" "}
                  <strong>Tribunal de Commerce de Paris</strong> sera seul
                  compétent pour arbitrer, quels que soient le lieu de livraison
                  et le mode de paiement accepté.
                </p>
                <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 mt-4">
                  <p className="font-semibold text-slate-800">
                    Contact :{" "}
                    <a
                      href="mailto:hello@zoonova.fr"
                      className="text-blue-600 hover:underline"
                    >
                      hello@zoonova.fr
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
