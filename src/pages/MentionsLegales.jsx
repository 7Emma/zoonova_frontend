import React from "react";

const LegalMentionsPage = () => {
  return (
    <div
      className="min-h-screen py-0 px-0"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="">
        <div className="py-8 xs:py-12 sm:py-16 md:py-20 px-3 xs:px-4 sm:px-6 md:px-8 max-w-full">
          <h1
            className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bowlby text-center mb-4 xs:mb-6 sm:mb-8 text-slate-700"
            style={{
              color: "white",
              WebkitTextStroke: "0.5px #000000",
            }}
          >
            Mentions légales
          </h1>

          <div className="space-y-4 xs:space-y-5 sm:space-y-6 text-slate-700 leading-relaxed max-w-5xl">
            {/* Section 1 */}
            <section className="">
              <h2 className="text-base xs:text-lg sm:text-xl font-bold text-slate-800 mb-2 xs:mb-3">
                1. Informations légales
              </h2>
              <div className="space-y-2 xs:space-y-3 sm:space-y-4 text-xs xs:text-sm sm:text-base">
                <p>
                  Le site www.zoonova.fr est édité par NACREALE, SAS enregistrée
                  au registre du commerce et des sociétés de Bobigny sous le
                  numéro 517 466 058.
                </p>
                <p>
                  Son siège social se trouve au 5 rue George Sand, 93430
                  Villetaneuse
                </p>
                <p>Editeur du site : NACREALE Editions</p>
                <p>Directrice de la publication : Nacreale Editions</p>
                <p>Hébergement : IONOS</p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="">
              <h2 className="text-base xs:text-lg sm:text-xl font-bold text-slate-800 mb-2 xs:mb-3">
                2. Service Client
              </h2>
              <p className="text-xs xs:text-sm sm:text-base">
                Contact :{" "}
                <a
                  href="mailto:hello@zoonova.fr"
                  className="text-blue-600 underline break-all hover:text-blue-800"
                >
                  hello@zoonova.fr
                </a>
              </p>
            </section>

            {/* Section 3 */}
            <section className="">
              <h2 className="text-base xs:text-lg sm:text-xl font-bold text-slate-800 mb-2 xs:mb-3">
                3. Protection des données personnelles
              </h2>
              <div className="space-y-2 xs:space-y-3 sm:space-y-4 text-xs xs:text-sm sm:text-base">
                <p>
                  Conformément à la loi informatique et libertés N° 78-17 du 06
                  janvier 1978, vous pouvez à tout moment modifier ou supprimer
                  les renseignements liés à votre inscription. Ces informations
                  vous concernant sont confidentielles, le propriétaire du site
                  s'engage donc à les protéger.
                </p>
                <p>
                  Vous disposez d'un droit d'accès, de modification, de
                  rectification et de suppression des données qui vous
                  concernent (art. 34 de la loi « Informatique et Libertés »).
                  Vous pouvez exercer ce droit directement sur le site ou en
                  nous contactant aux coordonnées indiquées ci-dessus.
                </p>
                <p className="font-semibold">Loi RGPD</p>
                <p>
                  Pour vous permettre d'acheter sur www.zoonova.fr, nous devons
                  collecter votre nom, email, adresse ainsi que votre numéro de
                  téléphone.
                </p>
                <p>
                  Le 25 mai 2018 est entré en vigueur le Règlement général sur
                  la Protection des Données (règlement européen n° 2016/679).
                  Dans le cadre de ce nouveau règlement, NACREALE ÉDITIONS vous
                  confirme que vos données personnelles ne sont JAMAIS
                  transmises à des tiers, car confidentielles.
                </p>
                <p>
                  Notre base de données ne servira JAMAIS à des fins
                  commerciales, et ne sera JAMAIS échangée, vendue ni cédée.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="">
              <h2 className="text-base xs:text-lg sm:text-xl font-bold text-slate-800 mb-2 xs:mb-3">
                4. Cookies
              </h2>
              <p className="text-xs xs:text-sm sm:text-base">
                L'utilisateur est informé, lors de ses visites sur le site qu'un
                cookie peut s'installer automatiquement sur son logiciel de
                navigation. Il ne servira pas à l'identifier, mais à enregistrer
                des informations relatives à sa navigation sur le site internet
                afin de lui faciliter sa navigation. Toutefois, l'utilisateur
                pourra désactiver ce cookie en effectuant les paramétrages dans
                son propre logiciel de navigation. L'utilisateur dispose d'un
                droit d'accès, de rectification ou de suppression des données
                personnelles communiquées par le biais des cookies.
              </p>
            </section>

            {/* Section 5 */}
            <section className="">
              <h2 className="text-base xs:text-lg sm:text-xl font-bold text-slate-800 mb-2 xs:mb-3">
                5. Propriété intellectuelle
              </h2>
              <div className="text-xs xs:text-sm sm:text-base">
                <p>
                  Tous les éléments du site sont et restent la propriété
                  intellectuelle et exclusive de NACREALE ÉDITIONS. Toute
                  reproduction, exploitation, rediffusion ou utilisation à
                  quelque titre que ce soit, même partiellement, des éléments du
                  site qu'ils soient logiciels, visuels ou sonores est
                  formellement interdit ; sans un accord explicite de NACREALE
                  ÉDITIONS.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalMentionsPage;
