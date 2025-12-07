import React from "react";
import nacreale from "../assets/png_rez/NACREALE.jpeg";

const NacrealePage = () => {
  return (
    <div
      className="min-h-screen py-6 sm:py-10"
      style={{
        background:
          "linear-gradient(135deg, #f0feda 0%, #f7fbe4 25%, #f4eae8 50%, #f0d2dc 75%, #ecd2c1 100%)",
      }}
    >
      <div className="">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="mt-2">
            <h1
              className="text-2xl sm:text-3xl md:text-5xl font-bowlby text-center mb-6 sm:mb-8 text-slate-700 leading-tight px-2"
              style={{
                color: "white",
                WebkitTextStroke: "1px #000000",
              }}
            >
              Découvrir Nacreale Editions
            </h1>

            <div className="mt-4 sm:mt-5 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                Bienvenue chez Nacreale Editions Nous sommes une
                micro-entreprise dédiée à l'imaginaire, à la créativité et au
                plaisir de partager. Et nous nous sommes donnés une mission
                toute simple : créer des livres et des jeux de société qui
                rapprochent les gens, éveillent la curiosité et font rêver
                petits et grands.
              </p>
              
              <p className="mt-4">
                Nous croyons que les histoires et les jeux sont des moyens
                puissants pour explorer le monde, nourrir l'esprit et créer des
                moments inoubliables. C'est pourquoi nous concevons avec soin
                chaque produit, en associant des récits captivants à des designs
                uniques, et des concepts ludiques à des expériences
                enrichissantes.
              </p>
              
              <p className="mt-4">
                Notre approche repose sur trois valeurs fondamentales :
              </p>

              <div className="mt-4 space-y-3 pl-2 sm:pl-4">
                <div className="flex items-start gap-2 sm:gap-4">
                  <span className="text-[#e63946] text-xl sm:text-2xl leading-none flex-shrink-0">•</span>
                  <p className="pt-0.5">
                    <span className="font-semibold">Créativité :</span> Imaginer des univers originaux et des jeux innovants qui
                    éveillent l'imagination.
                  </p>
                </div>

                <div className="flex items-start gap-2 sm:gap-4">
                  <span className="text-[#22c55e] text-xl sm:text-2xl leading-none flex-shrink-0">•</span>
                  <p className="pt-0.5">
                    <span className="font-semibold">Qualité :</span> Offrir
                    des œuvres et des objets conçus avec soin, où chaque détail
                    compte.
                  </p>
                </div>

                <div className="flex items-start gap-2 sm:gap-4">
                  <span className="text-[#3b82f6] text-xl sm:text-2xl leading-none flex-shrink-0">•</span>
                  <p className="pt-0.5">
                    <span className="font-semibold">Partage :</span> Créer
                    des supports qui rassemblent, que ce soit autour d'une table de
                    jeu ou au fil des pages d'un livre.
                  </p>
                </div>
              </div>
              
              <p className="mt-4">
                Chez Nacreale Editions chaque projet est une nouvelle aventure
                que nous menons avec enthousiasme et authenticité, que ce soit
                pour développer un roman illustré, un jeu collaboratif ou un
                conte pour enfants.
              </p>
              
              <p className="mt-4">
                Rejoignez-nous dans cette aventure pour découvrir des histoires
                inspirantes et des jeux rassembleurs ; aussi créateurs de
                souvenirs. Ensemble, faisons de chaque moment partagé une
                expérience mémorable.
              </p>
            </div>

            <div className="flex justify-center mt-8 mb-5">
              <div className="text-center">
                <img
                  src={nacreale}
                  width="1000"
                  alt="Image Nacréale"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NacrealePage;