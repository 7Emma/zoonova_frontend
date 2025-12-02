import React from "react";
import nacreale from "../assets/png/NACREALE.jpeg";

const NacrealePage = () => {
  return (
    <div
      className="min-h-screen py-10 px-6 md:px-12 lg:px-20"
      style={{
        background:
          "linear-gradient(135deg, #E8F5E3 0%, #FFF9E6 25%, #FFE8F0 50%, #E8D5FF 75%, #FFE5D9 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 lg:p-16">
          <div className="mt-2">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-slate-700">
              Découvrir Nacreale Editions
            </h1>

            <div className="mt-5 text-slate-700 leading-relaxed">
              <p>
                Bienvenue chez Nacreale Editions Nous sommes une
                micro-entreprise dédiée à l'imaginaire, à la créativité et au
                plaisir de partager. Et nous nous sommes donnés une mission
                toute simple : créer des livres et des jeux de société qui
                rapprochent les gens, éveillent la curiosité et font rêver
                petits et grands.
                <br />
                <br />
                Nous croyons que les histoires et les jeux sont des moyens
                puissants pour explorer le monde, nourrir l'esprit et créer des
                moments inoubliables. C'est pourquoi nous concevons avec soin
                chaque produit, en associant des récits captivants à des designs
                uniques, et des concepts ludiques à des expériences
                enrichissantes.
                <br />
                <br />
                Notre approche repose sur trois valeurs fondamentales :<br />
                <br />
                •&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Créativité :
                Imaginer des univers originaux et des jeux innovants qui
                éveillent l'imagination.
                <br />
                •&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Qualité :
                Offrir des œuvres et des objets conçus avec soin, où chaque
                détail compte.
                <br />
                •&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Partage : Créer
                des supports qui rassemblent, que ce soit autour d'une table de
                jeu ou au fil des pages d'un livre.
                <br />
                <br />
                Chez Nacreale Editions chaque projet est une nouvelle aventure
                que nous menons avec enthousiasme et authenticité, que ce soit
                pour développer un roman illustré, un jeu collaboratif ou un
                conte pour enfants.
                <br />
                <br />
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
                  width="600"
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
