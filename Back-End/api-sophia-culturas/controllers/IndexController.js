class IndexController{
    static async index(req, res){
        try {
            res.cookie(`Cookie token name`,[`encrypted cookie string Value`, 23, {jean: "oui"}]);
            await res.send(`<!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>form</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body>
                    <a href='../' id='si'>Loc</a>
                </body>
            </html>`)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = IndexController;