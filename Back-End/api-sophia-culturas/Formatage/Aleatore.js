const genererChaineAleatoire = (longueur) =>{
    const caracteres = '0123456789';
    let chaineAleatoire = '';
    for (let i = 0; i < longueur; i++){
        chaineAleatoire += caracteres[Math.floor(Math.random()*10)];
    }
    return chaineAleatoire;
}

module.exports = genererChaineAleatoire;