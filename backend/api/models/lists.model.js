const db = require('./db');


const getLists = async (userId) => {
    const result = await db.pool.query("SELECT * FROM lists WHERE user_id = $1", [userId]);
    return result.rows;
};

const getListByName = async (userId, listName) => {
    const result = await db.pool.query("SELECT * FROM lists WHERE user_id = $1 AND list_name = $2", [userId, listName]);
    return result.rows;
};

const getItemsFromList = async (listId) => {
    const result = await db.pool.query("SELECT * from items where items_id = $1", [listId])
    return result.rows;
}

const createList = async (userId, listName) => {
    try {
    const result = await db.pool.query(
        "INSERT INTO lists (user_id, list_name) VALUES ($1, $2) RETURNING *",
        [userId, listName]
    );
    return result.rows[0];
    } catch (error) {
        console.log(error);
        throw new Error("Error creating new list");
    }
};

const addItemToList = async (listId, itemName) => {
    try {
        const result = await db.pool.query("INSERT INTO items (items_id, data) VALUES ($1, $2) RETURNING *", [listId, itemName]);
        return result.rows[0]; // Return the newly created item
    } catch (error) {
        console.error(error);
        throw new Error('Error adding item to the list');
    }
};   

const deleteItemFromList = async (listName, itemName) => {
    const result = await db.pool.query("DELETE FROM items WHERE items_id = (SELECT id FROM lists WHERE list_name = $1) AND data = $2 RETURNING *", [listName, itemName]);
    return result.rowCount > 0;
};

const deleteList = async (listId) => {
    try {
        const result = await db.pool.query("DELETE FROM lists WHERE id = $1 RETURNING *", [listId]);
        
        if (result.rows.length === 0) {
            return null;  // List not found
        }

        return result.rows[0];  // Return the deleted list (optional)
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting list');
    }
};

module.exports = {
    getLists,
    getListByName,
    getItemsFromList,
    createList,
    addItemToList,
    deleteItemFromList,
    deleteList
};