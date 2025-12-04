import React from "react";

const LegalMentionsPage = () => {
  return (
    <div
      className="min-h-screen py-10 px-6 md:px-12 lg:px-20"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 lg:p-16">
          <h1
            className="text-4xl md:text-5xl font-bowlby text-center mb-12 text-slate-700"
            style={{
              color: "white",
              WebkitTextStroke: "1px #000000",
            }}
          >
            Mentions légales
          </h1>

          <div className="space-y-8 text-slate-700 leading-relaxed">
            {/* Section 1 */}
            <section className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                1. Informations légales
              </h2>
              <div className="space-y-3">
                <p>
                  Le site{" "}
                  <strong className="text-blue-600">www.zoonova.fr</strong> est
                  édité par <strong>NACREALE</strong>, SAS enregistrée au
                  registre du commerce et des sociétés de Bobigny sous le numéro{" "}
                  <strong>517 466 058</strong>.
                </p>
                <p>
                  Son siège social se trouve au{" "}
                  <strong>5 rue George Sand, 93430 Villetaneuse</strong>
                </p>
                <p>
                  <strong>Éditeur du site :</strong> NACREALE Editions
                </p>
                <p>
                  <strong>Directrice de la publication :</strong> Nacreale
                  Editions
                </p>
                <p>
                  <strong>Hébergement :</strong> IONOS
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-l-4 border-green-500 pl-6">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                2. Service Client
              </h2>
              <p>
                <strong>Contact :</strong>{" "}
                <a
                  href="mailto:hello@zoonova.fr"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  hello@zoonova.fr
                </a>
              </p>
            </section>

            {/* Section 3 */}
            <section className="border-l-4 border-purple-500 pl-6">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                3. Protection des données personnelles
              </h2>
              <div className="space-y-4">
                <p>
                  Conformément à la{" "}
                  <strong>
                    loi informatique et libertés N° 78-17 du 06 janvier 1978
                  </strong>
                  , vous pouvez à tout moment modifier ou supprimer les
                  renseignements liés à votre inscription. Ces informations vous
                  concernant sont confidentielles, le propriétaire du site
                  s'engage donc à les protéger.
                </p>
                <p>
                  Vous disposez d'un droit d'accès, de modification, de
                  rectification et de suppression des données qui vous
                  concernent (art. 34 de la loi « Informatique et Libertés »).
                  Vous pouvez exercer ce droit directement sur le site ou en
                  nous contactant aux coordonnées indiquées ci-dessus.
                </p>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-4">
                  <h3 className="text-xl font-bold mb-3 text-purple-900">
                    Loi RGPD
                  </h3>
                  <p>
                    Pour vous permettre d'acheter sur{" "}
                    <strong>www.zoonova.fr</strong>, nous devons collecter votre
                    nom, email, adresse ainsi que votre numéro de téléphone.
                  </p>
                  <p className="mt-3">
                    Le 25 mai 2018 est entré en vigueur le{" "}
                    <strong>
                      Règlement général sur la Protection des Données
                    </strong>{" "}
                    (règlement européen n° 2016/679). Dans le cadre de ce
                    nouveau règlement, <strong>NACREALE ÉDITIONS</strong> vous
                    confirme que vos données personnelles ne sont{" "}
                    <span className="text-red-600 font-bold">JAMAIS</span>{" "}
                    transmises à des tiers, car confidentielles.
                  </p>
                  <p className="mt-3">
                    Notre base de données ne servira{" "}
                    <span className="text-red-600 font-bold">JAMAIS</span> à des
                    fins commerciales, et ne sera{" "}
                    <span className="text-red-600 font-bold">JAMAIS</span>{" "}
                    échangée, vendue ni cédée.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="border-l-4 border-orange-500 pl-6">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                4. Cookies
              </h2>
              <p>
                L'utilisateur est informé, lors de ses visites sur le site qu'un
                cookie peut s'installer automatiquement sur son logiciel de
                navigation. Il ne servira pas à l'identifier, mais à enregistrer
                des informations relatives à sa navigation sur le site internet
                afin de lui faciliter sa navigation.
              </p>
              <p className="mt-3">
                Toutefois, l'utilisateur pourra désactiver ce cookie en
                effectuant les paramétrages dans son propre logiciel de
                navigation. L'utilisateur dispose d'un droit d'accès, de
                rectification ou de suppression des données personnelles
                communiquées par le biais des cookies.
              </p>
            </section>

            {/* Section 5 */}
            <section className="border-l-4 border-red-500 pl-6">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                5. Propriété intellectuelle
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="mb-3">
                  Tous les éléments du site sont et restent la{" "}
                  <strong>
                    propriété intellectuelle et exclusive de NACREALE ÉDITIONS
                  </strong>
                  .
                </p>
                <p>
                  Toute reproduction, exploitation, rediffusion ou utilisation à
                  quelque titre que ce soit, même partiellement, des éléments du
                  site qu'ils soient logiciels, visuels ou sonores est{" "}
                  <span className="text-red-600 font-bold">
                    formellement interdit
                  </span>{" "}
                  ; sans un accord explicite de NACREALE ÉDITIONS.
                </p>
              </div>
            </section>
          </div>

          {/* Footer info card */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-slate-700">
                <strong>Dernière mise à jour :</strong> Janvier 2025
              </p>
              <p className="text-slate-600 mt-2">
                Pour toute question concernant ces mentions légales,
                contactez-nous à{" "}
                <a
                  href="mailto:hello@zoonova.fr"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  hello@zoonova.fr
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalMentionsPage;
