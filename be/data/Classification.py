import os
import sys

import pandas as pd
# import sklearn
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from joblib import dump, load
import pickle

columns = ['pH', 'Temperature (°C)', 'Turbidity (NTU)', 'Dissolved Oxygen (mg/L)', 'Conductivity (µS/cm)']

# new_data = pd.DataFrame([[5,6,7,3,8]], columns=columns)
# # # Scale the new data sample
# new_data_scaled = scaler.transform(new_data)

# # # Predict the WQI for the new data
# predicted_wqi = classifier.predict(new_data_scaled)

# print(predicted_wqi[0])

def trainModel():
  # Load the dataset
  data = pd.read_csv('./Water_Quality.csv')

  # Check for null values
  null_values = data.isnull().sum()
  # print("Null Values:")
  # print(null_values)

  # Fill null values with appropriate data
  # Assuming you want to fill null values with the mean of each column
  data_filled = data.fillna(data.mean())

  # Check if null values are filled
  null_values_filled = data_filled.isnull().sum()
  # print("Null Values after filling:")
  # print(null_values_filled)

  # Separate the features and the target variable
  X = data.drop(['Sample ID', 'WQI'], axis=1)
  y = data['WQI']

  # Split the data into training and testing sets
  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

  # Scale the features
  scaler = StandardScaler()
  X_train = scaler.fit_transform(X_train)
  X_test = scaler.transform(X_test)

  dump(scaler, 'scaler_data.joblib')

  # Apply SMOTE to balance the data
  smote = SMOTE(random_state=42)
  X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

  # Train a Random Forest classifier
  classifier = RandomForestClassifier()
  classifier.fit(X_train_resampled, y_train_resampled)
  # Evaluate the classifier using cross-validation
  cv_scores = cross_val_score(classifier, X_train_resampled, y_train_resampled, cv=10)

  # Predict on the test set
  y_pred = classifier.predict(X_test)


  # Evaluate the classifier
  # print(classification_report(y_test, y_pred))
  # Print the accuracy for each fold
  # print("Cross-Validation Scores:", cv_scores)

  # Compute the mean accuracy across all folds
  mean_accuracy = cv_scores.mean()
  # print("Mean Accuracy:", mean_accuracy)

  # Evaluate the classifier on the original test set
  accuracy = accuracy_score(y_test, y_pred)
  # print("Accuracy on Test Set:", accuracy)

  dump(classifier, 'trained_model.joblib')


scaler_data = load(os.getcwd() + "/data/scaler_data.joblib")
trained_model = load(os.getcwd() + "/data/trained_model.joblib")

queries = {
  'predict_ph': scaler_data.mean_[0],
  'predict_temp': scaler_data.mean_[1],
  'predict_turbidity': scaler_data.mean_[2],
  'predict_do': scaler_data.mean_[3],
  'predict_conductivity': scaler_data.mean_[4],
}

datas = list(queries.values())

if len(sys.argv) > 1:
  for x in sys.argv[1:]:
    if x != '':
      datas[sys.argv.index(x) - 1] = float(x)


new_data = pd.DataFrame([datas], columns=columns)

# # Scale the new data sample
new_data_scaled = scaler_data.transform(new_data)

# # # Predict the WQI for the new data
predicted_wqi = trained_model.predict(new_data_scaled)

print(predicted_wqi[0])
# print(print('The scikit-learn version is {}.'.format(sklearn.__version__)))