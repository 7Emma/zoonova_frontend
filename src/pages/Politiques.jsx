import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div
      className="min-h-screen py-6 flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="flex-1 mt-0 sm:mt-6 lg:mt-4">
        <div className="p-4 sm:p-6 md:p-10">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bowlby text-center mb-6 sm:mb-8 text-slate-700 leading-tight"
            style={{
              color: "white",
              WebkitTextStroke: "1px #000000",
            }}
          >
            Conditions de ventes NACREALE ÉDITIONS
          </h1>

          <div className="space-y-4 sm:space-y-6 text-slate-700 leading-relaxed">
            {/* Section 1 */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                1. Objet
              </h2>
              <p className="text-sm sm:text-base">
                Les présentes conditions générales de vente s'appliquent à toute
                commande passée sur le site Internet www.zoonova.fr. NACREALE
                ÉDITIONS se réserve le droit de les adapter ou les modifier sans
                préavis. En cas de modification, ce sont ces nouvelles
                conditions générales de vente qui seront appliquées à chaque
                nouvelle commande.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                2. Disponibilité des produits
              </h2>
              <p className="text-sm sm:text-base">
                Nos produits sont valables dans la limite des stocks
                disponibles. À réception de votre commande, nous vérifions
                leurs disponibilités. En cas d'indisponibilité, nous nous
                engageons dans les 30 jours à compter de la passation de la
                commande à faire le nécessaire pour vous livrer le produit
                commandé. À défaut, nous vous proposerons un produit similaire
                à un prix similaire, ou nous vous rembourserons. La date de
                validation de la commande correspond à la date de
                l'acceptation de votre commande. En cas de rupture de stock
                sur l'un des produits de votre commande, nous vous le ferons
                savoir et expédierons le reste de votre commande, dans le
                délai maximum, susmentionné de 30 jours.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                3. Prix
              </h2>
              <p className="text-sm sm:text-base">
                Nos prix exprimés en euros TTC s'entendent hors frais de
                transport. Le client qui passe la commande devra s'en
                acquitter, sauf s'il bénéficie d'une offre spéciale l'en
                exonérant. NACREALE ÉDITIONS se réserve le droit de modifier
                ses prix sans préavis, notamment en cas d'augmentation des
                charges, du taux de TVA ou en cas d'erreur éditrice.
                Cependant, ce sont toujours les tarifs qui vous auront été
                indiqués au moment de votre commande (sous réserve de
                disponibilité des produits à cette date) qui seront ceux en
                vigueur.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                4. Paiement et sécurité
              </h2>
              <p className="text-sm sm:text-base">
                Les utilisateurs peuvent effectuer le règlement de leurs
                commandes par les moyens suivants : Carte Bleue, Carte Visa,
                Carte American Express et Carte MasterCard. Les données des
                cartes crédit sont cryptées en SSL 128 (Secure Socket Layer).
                Elles ne transitent donc jamais en clair sur le réseau et le
                paiement est directement effectué auprès de la banque.
                NACREALE ÉDITIONS n'a pas accès à ces données, et ne les garde
                pas sur ses serveurs. C'est la raison pour laquelle nous vous
                les redemandons à chaque nouvelle commande. Les produits
                demeurent la propriété de NACREALE ÉDITIONS jusqu'à leurs
                paiements intégraux. Toutefois dès la livraison, les risques
                des marchandises livrées sont transférés au client. NACREALE
                ÉDITIONS se réserve le droit, en cas de défaut de paiement, de
                refuser d'effectuer une livraison ou d'honorer une commande
                émanant d'un client utilisateur n'ayant pas réglé totalement
                ou partiellement une commande précédente ; voir avec lequel un
                litige de paiement subsiste.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                5. Livraison
              </h2>
              <p className="text-sm sm:text-base">
                NACREALE ÉDITIONS s'engagent à livrer les commandes sans
                délai. Elles seront acheminées par les services postaux qui
                seront tenus à leurs propres délais de livraison. Par
                conséquent NACREALE ÉDITIONS ne pourra pas être tenues
                responsables d'éventuels retards de livraison. Idem lorsque le
                client/utilisateur commet une erreur dans le libellé de son
                adresse, entraînant un retard de distribution au niveau des
                services postaux. Si la commande était retournée à NACREALE
                ÉDITIONS, le client/utilisateur accepte que les frais de
                réexpédition lui soient (re)facturés. Si d'aventure la
                commande arrivait défectueuse, l'utilisateur/client dispose
                d'un délai de 48 heures pour faire sa réclamation auprès
                NACREALE ÉDITIONS. Il sera ainsi procédé à l'échange du
                produit concerné.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                6. Responsabilités
              </h2>
              <p className="text-sm sm:text-base">
                NACREALE ÉDITIONS ne saura pas tenu responsable de la
                non-exécution du contrat de vente en cas de force majeure ou
                fortuit (inondations, incendies, tempête, etc.) de grève des
                services postaux et de perturbation des moyens de transport
                et/ou de communications. L'utilisateur client est le seul
                responsable de sa volonté d'achat sur www.zoonova.fr. Il ne
                pourra faire grief d'un préjudice ouvrant droit à un
                quelconque dédommagement s'il ne pouvait après son achat en
                faire l'usage auquel le produit est destiné. Lorsqu'un produit
                commandé est non livré, ou livré avec des produits manquants,
                l'acheteur doit se manifester dans un délai de jours (à
                compter de la date de la passation de commande). Au-delà de ce
                délai NACREALE ÉDITIONS ne pourra accepter aucune réclamation.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                7. Rétractation
              </h2>
              <p className="text-sm sm:text-base">
                NACREALE ÉDITIONS accorde à l'utilisateur un délai de 14 jours
                ouvrables à compter de la réception des produits commandés
                pour retourner à ses frais ceux qui ne lui conviendraient pas.
                Il doit cependant communiquer au préalable cette volonté de
                retour à l'adresse mail :{" "}
                <a 
                  href="mailto:hello@zoonova.fr"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  hello@zoonova.fr
                </a>
                {" "}Bien évidemment, les produits retournés doivent être à l'état
                neuf. En effet, tout produit détérioré, incomplet ou sali ne
                sera ni repris ni échangé. Après réception du produit retourné
                à l'état neuf par vos soins, NACREALE ÉDITIONS s'engage à vous
                faire un échange dans un délai maximum de 30 jours.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                8. Informations légales
              </h2>
              <p className="text-sm sm:text-base">
                Pour traiter, acheminer et facturer les commandes passées par
                l'utilisateur / acheteur, il est nécessaire que nous
                collections les informations nominatives aux fins de rendre
                possible ce contrat de vente à distance. Par conséquent, le
                défaut de renseignement entraîne la non-validation de la
                commande. Conformément à la loi "Informatique et Libertés", le
                traitement des informations nominatives relatives aux clients
                a fait l'objet d'une déclaration auprès de la Commission
                Nationale de l'Informatique et des Libertés (CNIL). De même,
                le client utilisateur dispose d'un droit d'accès, de
                modification, de rectification et de suppression des données
                le concernant, qu'il peut exercer auprès de NACREALE ÉDITIONS
                (article 34 de la loi du 6 janvier 1978). NACREALE ÉDITIONS
                s'engage à ne pas communiquer ou céder les coordonnées de ses
                clients à un tiers, de manière gratuite ou avec contrepartie.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                9. Droits applicables
              </h2>
              <p className="text-sm sm:text-base">
                Les présentes conditions générales de vente sont régies par la
                loi française. En cas de difficultés dans l'application du
                présent contrat NACREALE ÉDITIONS favorisera une démarche
                amiable avec le client acheteur avant toute action en justice.
                À défaut de conciliation, le Tribunal de Commerce de Paris
                sera seul compétent pour arbitrer, quels que soient le lieu de
                livraison et le mode de paiement accepté. Contact :{" "}
                <a 
                  href="mailto:hello@zoonova.fr"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  hello@zoonova.fr
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;