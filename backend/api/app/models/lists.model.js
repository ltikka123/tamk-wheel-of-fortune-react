const db = require('./db');

// Return all lists with specified userId
const getLists = async (userId) => {
    const result = await db.pool.query("SELECT * FROM lists WHERE user_id = $1", [userId]);
    return result.rows;
};

// Return a list with matching user id and list name
const getListByName = async (userId, listName) => {
    console.log("[DB]: ")
    const result = await db.pool.query("SELECT * FROM lists WHERE user_id = $1 AND list_name = $2", [userId, listName]);
    return result.rows;
};

// NO USER ID CHECKING
// get all items from list with id = listId
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
        throw new Error(error);
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

const deleteItemFromList = async (userId, listName, itemName) => {
    const result = await db.pool.query("DELETE FROM items WHERE items_id = (SELECT id FROM lists WHERE user_id = $1 AND list_name = $2) AND data = $3 RETURNING *", [userId, listName, itemName]);
    return result.rowCount > 0;
};

const deleteList = async (userId, listId) => {
    try {
        const result = await db.pool.query("DELETE FROM lists WHERE user_id = $1 AND id = $2 RETURNING *", [userId, listId]);
        
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