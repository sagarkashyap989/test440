export const dynamic = 'force-dynamic';




export async function POST(req) {

  const { searchParams } = new URL(req.url);
  const syllabus_id = searchParams.get('syllabus_id');

  const body = await req.json();
  const { auth0_id } = body;
  console.log(auth0_id, syllabus_id, 'u::ss:url')
  try {
    return new Response(
      JSON.stringify({
        "id": 12,
        "semester_id": 1,
        "course_code": "SIM101",
        "course_title": "Introduction to Simulation and Statistical Models",
        "credits": 3,
        "major_id": 1,
        "modules": [
          {
            "module_number": 1,
            "units": [
              {
                "unit_number": 1,
                "chapters": [
                  {
                    "id": 36,
                    "course_id": 12,
                    "name": "The Fundamentals of Machine Learning",
                    "module_number": 1,
                    "unit_number": 1,
                    "topics": [
                      {
                        "id": 342,
                        "chapter_id": 36,
                        "title": "Understanding Machine Learning"
                      },
                      {
                        "id": 343,
                        "chapter_id": 36,
                        "title": "Need and Relevance of Machine Learning"
                      },
                      {
                        "id": 344,
                        "chapter_id": 36,
                        "title": "Types of Machine Learning"
                      },
                      {
                        "id": 345,
                        "chapter_id": 36,
                        "title": "Supervised Learning"
                      },
                      {
                        "id": 346,
                        "chapter_id": 36,
                        "title": "Unsupervised Learning & Reinforcement Learning"
                      },
                      {
                        "id": 347,
                        "chapter_id": 36,
                        "title": "Challenges of Machine Learning"
                      },
                      {
                        "id": 348,
                        "chapter_id": 36,
                        "title": "Testing and Validation"
                      },
                      {
                        "id": 349,
                        "chapter_id": 36,
                        "title": "Classification"
                      },
                      {
                        "id": 350,
                        "chapter_id": 36,
                        "title": "MNIST Dataset"
                      },
                      {
                        "id": 351,
                        "chapter_id": 36,
                        "title": "Performance Measures"
                      },
                      {
                        "id": 352,
                        "chapter_id": 36,
                        "title": "Confusion Matrix"
                      },
                      {
                        "id": 353,
                        "chapter_id": 36,
                        "title": "Precision and Recall"
                      },
                      {
                        "id": 354,
                        "chapter_id": 36,
                        "title": "Precision/Recall Tradeoff"
                      },
                      {
                        "id": 355,
                        "chapter_id": 36,
                        "title": "The ROC Curve"
                      },
                      {
                        "id": 356,
                        "chapter_id": 36,
                        "title": "Multiclass Classification"
                      },
                      {
                        "id": 357,
                        "chapter_id": 36,
                        "title": "Error Analysis"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "module_number": 2,
            "units": [
              {
                "unit_number": 1,
                "chapters": [
                  {
                    "id": 37,
                    "course_id": 12,
                    "name": "Training Models",
                    "module_number": 2,
                    "unit_number": 1,
                    "topics": [
                      {
                        "id": 358,
                        "chapter_id": 37,
                        "title": "Linear Regression"
                      },
                      {
                        "id": 359,
                        "chapter_id": 37,
                        "title": "Gradient Descent"
                      },
                      {
                        "id": 360,
                        "chapter_id": 37,
                        "title": "Batch Gradient Descent"
                      },
                      {
                        "id": 361,
                        "chapter_id": 37,
                        "title": "Stochastic Gradient Descent"
                      },
                      {
                        "id": 362,
                        "chapter_id": 37,
                        "title": "Mini-batch Gradient Descent"
                      },
                      {
                        "id": 363,
                        "chapter_id": 37,
                        "title": "Polynomial Regression"
                      },
                      {
                        "id": 364,
                        "chapter_id": 37,
                        "title": "Learning Curves"
                      },
                      {
                        "id": 365,
                        "chapter_id": 37,
                        "title": "The Bias/Variance Tradeoff"
                      },
                      {
                        "id": 366,
                        "chapter_id": 37,
                        "title": "Ridge Regression"
                      },
                      {
                        "id": 367,
                        "chapter_id": 37,
                        "title": "Lasso Regression"
                      },
                      {
                        "id": 368,
                        "chapter_id": 37,
                        "title": "Early Stopping"
                      },
                      {
                        "id": 369,
                        "chapter_id": 37,
                        "title": "Logistic Regression"
                      },
                      {
                        "id": 370,
                        "chapter_id": 37,
                        "title": "Decision Boundaries"
                      },
                      {
                        "id": 371,
                        "chapter_id": 37,
                        "title": "Softmax Regression"
                      },
                      {
                        "id": 372,
                        "chapter_id": 37,
                        "title": "Cross Entropy"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "module_number": 3,
            "units": [
              {
                "unit_number": 1,
                "chapters": [
                  {
                    "id": 38,
                    "course_id": 12,
                    "name": "Support Vector Machines",
                    "module_number": 3,
                    "unit_number": 1,
                    "topics": [
                      {
                        "id": 373,
                        "chapter_id": 38,
                        "title": "Linear SVM Classification"
                      },
                      {
                        "id": 374,
                        "chapter_id": 38,
                        "title": "Soft Margin Classification"
                      },
                      {
                        "id": 375,
                        "chapter_id": 38,
                        "title": "Nonlinear SVM Classification"
                      },
                      {
                        "id": 376,
                        "chapter_id": 38,
                        "title": "Polynomial Kernel"
                      },
                      {
                        "id": 377,
                        "chapter_id": 38,
                        "title": "Gaussian RBF Kernel"
                      },
                      {
                        "id": 378,
                        "chapter_id": 38,
                        "title": "SVM Regression"
                      },
                      {
                        "id": 379,
                        "chapter_id": 38,
                        "title": "Decision Trees"
                      },
                      {
                        "id": 380,
                        "chapter_id": 38,
                        "title": "Training and Visualizing a Decision Tree"
                      },
                      {
                        "id": 381,
                        "chapter_id": 38,
                        "title": "Making Predictions"
                      },
                      {
                        "id": 382,
                        "chapter_id": 38,
                        "title": "The CART Training Algorithm"
                      },
                      {
                        "id": 383,
                        "chapter_id": 38,
                        "title": "Gini Impurity vs Entropy"
                      },
                      {
                        "id": 384,
                        "chapter_id": 38,
                        "title": "Regularization Hyperparameters"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "module_number": 4,
            "units": [
              {
                "unit_number": 1,
                "chapters": [
                  {
                    "id": 39,
                    "course_id": 12,
                    "name": "Fundamentals of Deep Learning",
                    "module_number": 4,
                    "unit_number": 1,
                    "topics": [
                      {
                        "id": 385,
                        "chapter_id": 39,
                        "title": "What is Deep Learning?"
                      },
                      {
                        "id": 386,
                        "chapter_id": 39,
                        "title": "Need Deep Learning?"
                      },
                      {
                        "id": 387,
                        "chapter_id": 39,
                        "title": "Introduction to Artificial Neural Network (ANN)"
                      },
                      {
                        "id": 388,
                        "chapter_id": 39,
                        "title": "Core components of neural networks"
                      },
                      {
                        "id": 389,
                        "chapter_id": 39,
                        "title": "Multi-Layer Perceptron (MLP)"
                      },
                      {
                        "id": 390,
                        "chapter_id": 39,
                        "title": "Activation functions"
                      },
                      {
                        "id": 391,
                        "chapter_id": 39,
                        "title": "Sigmoid"
                      },
                      {
                        "id": 392,
                        "chapter_id": 39,
                        "title": "Rectified Linear Unit (ReLU)"
                      },
                      {
                        "id": 393,
                        "chapter_id": 39,
                        "title": "Introduction to Tensors and Operations"
                      },
                      {
                        "id": 394,
                        "chapter_id": 39,
                        "title": "Tensorflow framework"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "topicLength": 53
      }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    // const response = await fetch('${process.env.API_URL}topics/:id', {
    const response = await fetch(`${process.env.API_URL}courses/getAllDet/${syllabus_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auth0_id: auth0_id }),
    });

    if (!response.ok) {
      throw new Error(`External API returned status ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
