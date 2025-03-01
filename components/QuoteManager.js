import { useState, useEffect } from 'react';
import axios from 'axios';

const QuoteManager = () => {
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [categories, setCategories] = useState([]);
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [additionalCost, setAdditionalCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [searchFilters, setSearchFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false); // For loading state

  // Fetch projects on initial load
  useEffect(() => {
    axios
      .get('http://localhost:5000/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => console.error('Error fetching projects:', err));
  }, []);

  // Fetch customer and categories when projectId is selected
  useEffect(() => {
    if (projectId) {
      setIsLoading(true); // Show loading indicator when fetching data
      axios
        .get(`http://localhost:5000/customer/${projectId}`)
        .then((res) => setCustomer(res.data))
        .catch((err) => console.error('Error fetching customer:', err));

      axios
        .get('http://localhost:5000/categories')
        .then((res) => setCategories(res.data))
        .catch((err) => console.error('Error fetching categories:', err))
        .finally(() => setIsLoading(false)); // Hide loading indicator after data is fetched
    }
  }, [projectId]);

  // Fetch items for each category
  useEffect(() => {
    if (categories.length > 0) {
      categories.forEach((category) => {
        axios
          .get(`http://localhost:5000/items/${category.category_id}`)
          .then((res) =>
            setItemsByCategory((prev) => ({
              ...prev,
              [category.category_id]: res.data,
            }))
          )
          .catch((err) =>
            console.error(
              `Error fetching items for category ${category.category_name}:`,
              err
            )
          );
      });
    }
  }, [categories]);

  // Calculate the total cost whenever selectedItems or additionalCost changes
  useEffect(() => {
    const selectedCosts = {
      Drip: 0,
      Plumbing: 0,
      Automation: 0,
      Labour: 0,
    };

    Object.entries(selectedItems).forEach(([categoryId, items]) => {
      items.forEach((item) => {
        const categoryName = categories.find(
          (cat) => cat.category_id === parseInt(categoryId)
        )?.category_name;
        if (categoryName && selectedCosts.hasOwnProperty(categoryName)) {
          selectedCosts[categoryName] += item.cost * item.quantity;
        }
      });
    });

    const total =
      Object.values(selectedCosts).reduce((acc, cost) => acc + (cost || 0), 0) +
      parseFloat(additionalCost || 0);

    setTotalCost(total);
  }, [selectedItems, additionalCost, categories]);

  // Handle item selection
  const handleItemSelection = (categoryId, item_id, cost) => {
    setSelectedItems((prev) => {
      const categoryItems = prev[categoryId] || [];
      if (categoryItems.some((item) => item.item_id === item_id)) {
        return {
          ...prev,
          [categoryId]: categoryItems.filter((item) => item.item_id !== item_id),
        };
      } else {
        return {
          ...prev,
          [categoryId]: [
            ...categoryItems,
            { item_id, cost: parseFloat(cost), quantity: 1 },
          ],
        };
      }
    });
  };

  // Handle quantity change for an item
  const handleQuantityChange = (categoryId, item_id, quantity) => {
    setSelectedItems((prev) => {
      const categoryItems = prev[categoryId] || [];
      const updatedItems = categoryItems.map((item) =>
        item.item_id === item_id ? { ...item, quantity: parseInt(quantity) } : item
      );
      return {
        ...prev,
        [categoryId]: updatedItems,
      };
    });
  };

  // Save quote to the backend
  const saveQuote = () => {
    const categoryCosts = categories.reduce((acc, category) => {
      const items = selectedItems[category.category_id] || [];
      acc[`${category.category_name.toLowerCase()}_cost`] = items.reduce((sum, item) => sum + item.cost * item.quantity, 0);
      return acc;
    }, {});
  
    axios.post("http://localhost:5000/save-quote", {
      project_id: projectId,
      customer_name: customer?.customer_name,
      ...categoryCosts,
      additional_cost: parseFloat(additionalCost),
      total_cost: totalCost,
    }).then(() => alert("Quote saved successfully!"))
      .catch(err => console.error("Error saving quote:", err));
  };
  

  // Handle search filter for items
  const handleSearchChange = (categoryId, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
  };

  // Filter items based on search query
  const getFilteredItems = (categoryId) => {
    const filter = searchFilters[categoryId]?.toLowerCase() || '';
    if (!filter) {
      return []; // Don't show items until the user starts typing
    }
    return itemsByCategory[categoryId]?.filter((item) =>
      item.item_name.toLowerCase().includes(filter)
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: 'white', color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Quote Management</h1>

      {/* Select Project */}
      <label>Select Project ID:</label>
      <select
        onChange={(e) => setProjectId(e.target.value)}
        value={projectId}
        style={{ padding: '5px', margin: '10px 0' }}
      >
        <option value="">-- Select Project --</option>
        {projects.map((proj) => (
          <option key={proj.project_id} value={proj.project_id}>
            {proj.project_id}
          </option>
        ))}
      </select>

      {/* Customer Details */}
      {customer && (
        <p>
          <strong>Customer:</strong> {customer.customer_name}, <strong>Address:</strong>{' '}
          {customer.address}
        </p>
      )}

      {/* Categories and Items */}
      {categories.map((cat) => (
        <div key={cat.category_id} style={{ marginBottom: '20px' }}>
          <h3>{cat.category_name}</h3>

          {/* Search Bar */}
          <input
            type="text"
            placeholder={`Search items in ${cat.category_name}`}
            value={searchFilters[cat.category_id] || ''}
            onChange={(e) => handleSearchChange(cat.category_id, e.target.value)}
            style={{
              padding: '5px',
              marginBottom: '10px',
              width: '100%',
              borderRadius: '4px',
            }}
          />

          {/* List Items */}
          {getFilteredItems(cat.category_id)?.map((item) => (
            <div key={item.item_id} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id={`item-${item.item_id}`}
                onChange={() =>
                  handleItemSelection(cat.category_id, item.item_id, item.amount)
                }
                checked={selectedItems[cat.category_id]?.some(
                  (i) => i.item_id === item.item_id
                ) || false}
              />
              <label htmlFor={`item-${item.item_id}`} style={{ marginLeft: '10px' }}>
                {item.item_name} (${item.amount})
              </label>

              {/* Quantity Input */}
              {selectedItems[cat.category_id]?.some(
                (i) => i.item_id === item.item_id
              ) && (
                <div style={{ marginLeft: '10px' }}>
                  <input
                    type="number"
                    value={
                      selectedItems[cat.category_id]?.find(
                        (i) => i.item_id === item.item_id
                      )?.quantity || 1
                    }
                    onChange={(e) =>
                      handleQuantityChange(
                        cat.category_id,
                        item.item_id,
                        e.target.value
                      )
                    }
                    min="1"
                    style={{ width: '60px' }}
                  />
                  <span style={{ marginLeft: '10px' }}>
                    Total: ${(
                      (selectedItems[cat.category_id]?.find(
                        (i) => i.item_id === item.item_id
                      )?.quantity || 1) * item.amount
                    ).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Additional Costs and Total */}
      {projectId && (
        <div>
          <label>Additional Cost ($):</label>
          <input
            type="number"
            value={additionalCost}
            onChange={(e) => setAdditionalCost(e.target.value)}
            placeholder="Enter additional cost"
            style={{
              padding: '5px',
              marginBottom: '10px',
              width: '100px',
              borderRadius: '4px',
            }}
          />
        </div>
      )}

      {projectId && (
        <h2 style={{ color: 'blue', marginTop: '10px' }}>
          Total Cost: ${totalCost.toFixed(2)}
        </h2>
      )}

      {/* Save Button */}
      <button
        onClick={saveQuote}
        style={{
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Save Quote
      </button>
    </div>
  );
};

export default QuoteManager;
