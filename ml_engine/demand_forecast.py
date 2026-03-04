import numpy as np
from sklearn.linear_model import LinearRegression
import pandas as pd

def predict_optimal_price(historical_sales: list, current_stock: int, base_price: float) -> float:
    """
    Uses Scikit-Learn to predict an optimal markdown price based on simple linear regression.
    This is a mocked model that assumes higher recent sales mean less discount needed.
    """
    if not historical_sales or len(historical_sales) < 3:
        return base_price * 0.9 # Default 10% discount if not enough data
        
    # Mock Feature extraction
    # X = [week_index]
    # y = [sales_amount]
    X = np.array(range(len(historical_sales))).reshape(-1, 1)
    y = np.array(historical_sales)
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict next week's sales at current base price
    predicted_sales = model.predict([[len(historical_sales)]])[0]
    
    # Simple logic to determine price
    # If predicted sales > current stock, we don't need a markdown
    if predicted_sales >= current_stock:
        return base_price
        
    # If we have excess stock, calculate discount
    # Let's say we want to clear stock in 4 weeks
    desired_weekly_sales = current_stock / 4.0
    
    # The bigger the gap, the bigger the discount
    gap = desired_weekly_sales - predicted_sales
    
    if gap <= 0:
        return base_price
        
    # Max discount of 50%
    discount_factor = min(0.5, gap * 0.05) 
    
    optimal_price = base_price * (1 - discount_factor)
    return round(optimal_price, 2)
