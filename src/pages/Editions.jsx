import React from "react";
import nacreale from "../assets/png_rez/NACREALE.jpeg";

const NacrealePage = () => {
  return (
    <div
      className="min-h-screen py-10 px-0"
      style={{
        background:
          "linear-gradient(135deg, #f0feda 0%, #f7fbe4 25%, #f4eae8 50%, #f0d2dc 75%, #ecd2c1 100%)",
      }}
    >
      <div className="">
        <div className="p-8 max-w-full">
          <div className="mt-2">
            <h1
              className="text-4xl font-bowlby text-center mb-8 text-slate-700"
              style={{
                color: "white",
                WebkitTextStroke: "1px #000000",
              }}
            >
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
                <span style={{ color: "#e63946", fontSize: "1.5rem" }}>•</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Créativité :
                Imaginer des univers originaux et des jeux innovants qui
                éveillent l'imagination.
                <br />
                <span style={{ color: "#22c55e", fontSize: "1.5rem" }}>•</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Qualité : Offrir
                des œuvres et des objets conçus avec soin, où chaque détail
                compte.
                <br />
                <span style={{ color: "#3b82f6", fontSize: "1.5rem" }}>•</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Partage : Créer
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
