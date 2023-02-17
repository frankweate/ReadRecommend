import numpy as np
from keras.layers import Embedding, Reshape, concatenate, Dense, Input
from keras.models import Model

class baseModel(Model):

    # The constructor for the class
    def __init__(self, n_users, m_items, k_factors):
        super(baseModel, self).__init__()
        self.U = Input(shape=(n_users,))
        self.EU = Embedding(n_users, k_factors, input_length=1)
        self.RU = Reshape((k_factors,))
        self.B = Input(shape=(m_items,))
        self.EB = Embedding(m_items, k_factors, input_length=1)
        self.RB = Reshape((k_factors,))
        self.O = Dense(1,activation='relu')

    # The rate function to predict user's rating of unrated items
    def call(self, inputs, training=False):
        x = self.U(inputs[0])
        x = self.EU(x)
        x = self.RU(x)
        y = self.B(inputs[1])
        y = self.EB(y)
        y = self.RB(y)
        c = concatenate([x,y])
        return self.O(c)
